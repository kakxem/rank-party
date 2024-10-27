import type * as Party from "partykit/server";
import {
  Messages,
  Role,
  Scene,
  type ConnectionData,
  type Game,
  type PlayerConnection,
  type Settings,
} from "../src/types.ts";
import { createNewGame, joinGame, sendError } from "./actions.ts";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onStart() {
    // Initialize storage if it's empty
    const games = await this.room.storage.get("games");

    if (!games) {
      await this.room.storage.put("games", []);
    }
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const url = new URL(ctx.request.url);
    const connectionData = this.getConnectionData(url);
    const { player, join } = connectionData;
    const game = await this.getGame();

    if (join) {
      if (!game) {
        sendError({ conn, message: "Game not found" });
        return conn.close();
      }

      if (game?.settings.blacklist.includes(player.id)) {
        sendError({ conn, message: "You are not allowed to join this game" });
        return conn.close();
      }
    }

    let newGame = game;
    if (game) {
      newGame = joinGame({ game, player });
      await this.updateGame(newGame);
    } else {
      newGame = createNewGame({ player });
      await this.addGame(newGame);
    }

    // Set the player id in the connection state
    conn.setState({
      id: player.id,
    });

    this.broadcastUpdate(newGame);
  }

  async onMessage(message: string, sender: PlayerConnection) {
    const { type, data } = JSON.parse(message);
    const playerId = sender.state?.id as string;
    const game = await this.getGame();

    if (!game) return;

    const messageHandlers = {
      [Messages.UPDATE_ROOM_NAME]: () => this.handleUpdateRoomName(data),
      [Messages.ADD_ITEM]: () =>
        this.handleAddItem(game, data, playerId, sender),
      [Messages.IMPORT_LIST]: () => this.handleImportList(game, data),
      [Messages.DELETE_ITEM]: () => this.handleDeleteItem(game, data),
      [Messages.START_GAME]: () => this.handleStartGame(game, sender),
      [Messages.BACK_TO_LOBBY]: () => this.handleBackToLobby(game),
      [Messages.ADD_SCORE]: () => this.handleAddScore(game, data, playerId),
      [Messages.UPDATE_SETTINGS]: () => this.handleUpdateSettings(game, data),
      [Messages.REMOVE_PLAYER]: () =>
        this.handleRemovePlayer(game, data, playerId),
    };

    if (messageHandlers[type]) {
      messageHandlers[type](); // Call the handler if it exists
    }
  }

  async onClose(conn: PlayerConnection) {
    const game = await this.getGame();
    if (!game) return;

    game.players = game.players.map((item) =>
      item.id === conn.state?.id ? { ...item, active: false } : item,
    );

    if (game.players.every((item) => !item.active)) {
      // Maybe this is not needed, because probably the room will be deleted when the last connection is closed
      await this.room.storage.delete("game");
    } else {
      this.updateAndPublishGame({
        updatedGame: game,
      });
    }
  }

  private getConnectionData(url: URL): ConnectionData {
    return JSON.parse(url.searchParams.get("data") || "{}");
  }

  private async getGame() {
    return (await this.room.storage.get("game")) as Game | undefined;
  }

  private async addGame(game: Game) {
    await this.room.storage.put("game", game);
  }

  private async updateGame(game: Game) {
    await this.room.storage.put("game", game);
  }

  private async updateAndPublishGame({
    updatedGame,
  }: {
    updatedGame: Partial<Game>;
  }) {
    const game = await this.getGame();
    if (!game) return;

    Object.assign(game, updatedGame);
    await this.updateGame(game);

    this.broadcastUpdate(game);
  }

  private broadcastUpdate(game: Game) {
    const message = JSON.stringify({
      type: Messages.UPDATE_CLIENT,
      data: game,
    });

    for (const connection of this.room.getConnections()) {
      connection.send(message);
    }
  }

  private handleUpdateRoomName(data: { newName: string }) {
    this.updateAndPublishGame({
      updatedGame: { name: data.newName },
    });
  }

  private handleAddItem(
    game: Game,
    data: { name: string; link: string },
    playerId: string,
    sender: Party.Connection,
  ) {
    const { name, link } = data;

    const isDuplicate = game.list.some(
      (item) => item.name === name || item.link === link,
    );
    if (isDuplicate) {
      return sendError({ conn: sender, message: "Item already exists" });
    }

    game.list.push({
      id: `${name}-${link}`,
      name,
      link,
      createdBy: playerId,
      score: [],
    });
    this.updateAndPublishGame({
      updatedGame: { list: game.list },
    });
  }

  private handleImportList(game: Game, data: { list: Game["list"] }) {
    game.list = data.list;
    this.updateAndPublishGame({
      updatedGame: game,
    });
  }

  private handleDeleteItem(game: Game, data: { id: string }) {
    game.list = game.list.filter((item) => item.id !== data.id);
    this.updateAndPublishGame({
      updatedGame: { list: game.list },
    });
  }

  private handleStartGame(game: Game, sender: Party.Connection) {
    if (game.list.length < 2) {
      return sendError({ conn: sender, message: "Not enough items" });
    }

    game.scene = Scene.GAME;
    const randomList = game.list.slice().sort(() => Math.random() - 0.5);
    game.list = randomList;
    game.state = { actualItem: 0, executingTimeout: false };

    this.updateAndPublishGame({
      updatedGame: {
        scene: game.scene,
        state: game.state,
        list: game.list,
      },
    });
  }

  private handleBackToLobby(game: Game) {
    game.scene = Scene.LOBBY;
    game.state = { actualItem: 0, executingTimeout: false };
    game.list = game.list.map((item) => ({
      ...item,
      score: [],
    }));

    this.updateAndPublishGame({
      updatedGame: game,
    });
  }

  private handleAddScore(
    game: Game,
    data: { score: number },
    playerId: string,
  ) {
    const { score } = data;
    const actualItem = game.list[game.state.actualItem];

    const oldScore = actualItem.score.findIndex(
      (item) => item.player === playerId,
    );
    if (oldScore !== -1) {
      actualItem.score[oldScore].score = score;
    } else {
      actualItem.score.push({
        player: playerId,
        score,
      });
    }

    const activePlayers = game.players.filter((item) => item.active).length;
    if (
      actualItem.score.length === activePlayers &&
      !game.state.executingTimeout
    ) {
      game.state.executingTimeout = true;
      setTimeout(() => {
        game.state = {
          actualItem: game.state.actualItem + 1,
          executingTimeout: false,
        };

        // If the last item was reached, end the game
        if (game.state.actualItem === game.list.length) {
          game.scene = Scene.RESULT;
        }

        this.updateAndPublishGame({
          updatedGame: game,
        });
      }, game.settings.timeout * 1000);
    }

    this.updateAndPublishGame({
      updatedGame: game,
    });
  }

  private handleUpdateSettings(game: Game, data: Partial<Settings>) {
    game.settings = {
      ...game.settings,
      ...data,
    };

    this.updateAndPublishGame({
      updatedGame: game,
    });
  }

  private handleRemovePlayer(
    game: Game,
    data: { playerId: string },
    adminId: string,
  ) {
    // Check if the sender is an admin
    const sender = game.players.find((p) => p.id === adminId);
    if (sender?.role !== Role.ADMIN) return;

    // Add player to blacklist
    game.settings.blacklist = [...game.settings.blacklist, data.playerId];

    // Update game with new blacklist
    this.updateAndPublishGame({
      updatedGame: { settings: game.settings },
    });

    // Find and close the connection of the target player
    for (const conn of this.room.getConnections()) {
      const state = conn.state as { id: string } | undefined;
      if (state?.id === data.playerId) {
        sendError({
          conn,
          message: "You have been removed from the game by the admin",
        });
        conn.close();
        break;
      }
    }
  }
}

Server satisfies Party.Worker;
