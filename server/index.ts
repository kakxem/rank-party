import Bun from "bun";
import { Messages, Scene, type ConnectionData, type Game } from "../src/types";
import { createNewGame, joinGame, sendError } from "./actions";

const games: Game[] = [];

const getConnectionData = (req: Request) => {
  const url = new URL(req.url);
  const data: ConnectionData = JSON.parse(url.searchParams.get("data") || "{}");

  return data;
};

const getGameInfo = (roomCode: string) => {
  const index = games.findIndex((game) => game.id === roomCode);
  const game = index !== -1 ? structuredClone(games[index]) : undefined;
  const roomName = `room-${roomCode}`;

  return { game, index, roomName };
};

const updateAndPublishGame = ({
  roomCode,
  updatedGame,
  server,
}: {
  roomCode: string;
  updatedGame: Partial<Game>;
  server: Bun.Server;
}) => {
  const { game, index, roomName } = getGameInfo(roomCode);

  if (game) {
    // Update game with new data
    Object.assign(game, updatedGame);
    games[index] = game;

    // Publish updated game state
    server.publish(
      roomName,
      JSON.stringify({ type: Messages.UPDATE_CLIENT, data: game }),
    );
  }
};

const server = Bun.serve<ConnectionData>({
  port: 5000,
  fetch(req, server) {
    const { pathname } = new URL(req.url);
    const connectionData = getConnectionData(req);
    console.log(connectionData);

    if (pathname === "/join") {
      const game = games.find((game) => game.id === connectionData.roomCode);

      if (!game) {
        console.log("game not found");
        return new Response(null, {
          status: 404,
        });
      }
    }

    server.upgrade(req, {
      data: connectionData,
    });
  },
  websocket: {
    idleTimeout: 10,
    open(ws) {
      const { roomCode, player } = ws.data;
      const { game, index, roomName } = getGameInfo(roomCode);
      let newGame = game;

      if (game) {
        newGame = joinGame({ game, player });
        games[index] = newGame;
      } else {
        newGame = createNewGame({ player, roomCode });
        games.push(newGame);
      }

      ws.subscribe(roomName);
      updateAndPublishGame({
        roomCode,
        updatedGame: newGame,
        server,
      });
    },
    message(ws, message) {
      if (typeof message !== "string") return;

      const { roomCode, player } = ws.data;
      const { type, data } = JSON.parse(message);
      const { game } = getGameInfo(roomCode);

      if (type === Messages.UPDATE_ROOM_NAME) {
        const { newName } = data;
        updateAndPublishGame({
          roomCode,
          updatedGame: { name: newName },
          server,
        });
      }

      if (type === Messages.ADD_ITEM) {
        const { name, link } = data;

        if (game) {
          const isDuplicate = game.list.some(
            (item) => item.name === name || item.link === link,
          );
          if (isDuplicate) {
            return sendError({ ws, message: "Item already exists" });
          }

          game.list.push({
            id: `${name}-${link}`,
            name,
            link,
            createdBy: player.id,
            score: [],
          });
          updateAndPublishGame({
            roomCode,
            updatedGame: { list: game.list },
            server,
          });
        }
      }

      if (type === Messages.DELETE_ITEM) {
        const { id } = data;

        if (game) {
          game.list = game.list.filter((item) => item.id !== id);
          updateAndPublishGame({
            roomCode,
            updatedGame: { list: game.list },
            server,
          });
        }
      }

      if (type === Messages.START_GAME) {
        if (game) {
          game.scene = Scene.GAME;
          updateAndPublishGame({
            roomCode,
            updatedGame: { scene: game.scene },
            server,
          });
        }
      }
    },
    close(ws) {
      const { roomCode, player } = ws.data;
      const { game, roomName } = getGameInfo(roomCode);

      if (game) {
        game.players = game.players.map((item) =>
          item.id === player.id ? { ...item, active: false } : item,
        );

        // TODO: Handle ADMIN role transfer if necessary

        ws.unsubscribe(roomName);
        updateAndPublishGame({
          roomCode,
          updatedGame: game,
          server,
        });
      }
    },
  },
});

console.log(`Server listening on ${server.hostname}:${server.port}`);
