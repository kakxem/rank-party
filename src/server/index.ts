import { Application, Router } from "https://deno.land/x/oak@v17.0.0/mod.ts";
import { Messages, Scene, type ConnectionData, type Game } from "../types.ts";
import { createNewGame, joinGame, sendError } from "./actions.ts";

const games: Game[] = [];
const connectedClients = new Map<
  string,
  WebSocket & {
    data: ConnectionData;
  }
>();

const app = new Application();
const port = Deno.env.get("PORT") ?? 443;
const router = new Router();

const getConnectionData = (url: URL) => {
  return JSON.parse(url.searchParams.get("data") || "{}");
};

const getGameInfo = (roomCode: string) => {
  const index = games.findIndex((game) => game.id === roomCode);
  const game = index !== -1 ? structuredClone(games[index]) : undefined;

  return { game, index, roomCode };
};

function broadcast(roomCode: string, message: string) {
  for (const client of connectedClients.values()) {
    if (client.data.roomCode === roomCode) {
      client.send(message);
    }
  }
}

const updateAndPublishGame = ({
  roomCode,
  updatedGame,
}: {
  roomCode: string;
  updatedGame: Partial<Game>;
}) => {
  const { game, index } = getGameInfo(roomCode);

  if (game) {
    Object.assign(game, updatedGame);
    games[index] = game;
    broadcast(
      roomCode,
      JSON.stringify({ type: Messages.UPDATE_CLIENT, data: game }),
    );
  }
};

router.get("/", async (ctx) => {
  const socket = (await ctx.upgrade()) as WebSocket & { data: ConnectionData };
  const connectionData = getConnectionData(ctx.request.url);
  socket.data = connectionData;

  socket.onopen = () => {
    const { roomCode, player, join } = connectionData;
    const { game, index } = getGameInfo(roomCode);

    if (!game && join) {
      // close the socket
      sendError({ ws: socket, message: "Game not found" });
      return socket.close();
    }

    let newGame = game;
    if (game) {
      newGame = joinGame({ game, player });
      games[index] = newGame;
    } else {
      newGame = createNewGame({ player, roomCode });
      games.push(newGame);
    }

    connectedClients.set(player.id, socket);
    updateAndPublishGame({
      roomCode,
      updatedGame: newGame,
    });
    console.log("socket opened");
  };

  socket.onclose = () => {
    const { roomCode, player } = socket.data;
    connectedClients.delete(player.id);
    const { game } = getGameInfo(roomCode);
    if (game) {
      game.players = game.players.map((item) =>
        item.id === player.id ? { ...item, active: false } : item,
      );
      updateAndPublishGame({
        roomCode,
        updatedGame: game,
      });
    }
  };

  socket.onmessage = (m) => {
    if (typeof m.data !== "string") return;

    const { type, data } = JSON.parse(m.data);
    const { roomCode, player } = socket.data;
    const { game } = getGameInfo(roomCode);

    if (!game) return sendError({ ws: socket, message: "Game not found?" });

    if (type === Messages.UPDATE_ROOM_NAME) {
      const { newName } = data;
      updateAndPublishGame({
        roomCode,
        updatedGame: { name: newName },
      });
    }

    if (type === Messages.ADD_ITEM) {
      const { name, link } = data;

      const isDuplicate = game.list.some(
        (item) => item.name === name || item.link === link,
      );
      if (isDuplicate) {
        return sendError({ ws: socket, message: "Item already exists" });
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
      });
    }

    if (type === Messages.IMPORT_LIST) {
      const { list } = data;
      game.list = list;
      updateAndPublishGame({
        roomCode,
        updatedGame: game,
      });
    }

    if (type === Messages.DELETE_ITEM) {
      const { id } = data;

      game.list = game.list.filter((item) => item.id !== id);
      updateAndPublishGame({
        roomCode,
        updatedGame: { list: game.list },
      });
    }

    if (type === Messages.START_GAME) {
      if (game.list.length < 2) {
        return sendError({ ws: socket, message: "Not enough items" });
      }

      game.scene = Scene.GAME;
      const randomList = game.list.slice().sort(() => Math.random() - 0.5);
      game.list = randomList;
      game.state = { actualItem: 0, executingTimeout: false };

      updateAndPublishGame({
        roomCode,
        updatedGame: {
          scene: game.scene,
          state: game.state,
          list: game.list,
        },
      });
    }

    if (type === Messages.ADD_SCORE) {
      const { score } = data;
      const actualItem = game.list[game.state.actualItem];

      const oldScore = actualItem.score.findIndex(
        (item) => item.player === player.id,
      );
      if (oldScore !== -1) {
        actualItem.score[oldScore].score = score;
      } else {
        actualItem.score.push({
          player: player.id,
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

          updateAndPublishGame({
            roomCode,
            updatedGame: game,
          });
        }, 5000);
      }

      updateAndPublishGame({
        roomCode,
        updatedGame: game,
      });
    }
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server listening on http://localhost:${port}`);
await app.listen({ port });
