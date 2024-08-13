import Bun from "bun";
import { Messages, type ConnectionData, type Game } from "../src/types";
import { createNewGame, joinGame } from "./actions";

const games: Game[] = [];

const getConnectionData = (req: Request) => {
  const url = new URL(req.url);
  const data: ConnectionData = JSON.parse(url.searchParams.get("data") || "{}");

  return data;
};

const getGameInfo = (roomCode: string) => {
  const game = games.find((game) => game.id === roomCode);
  const index = games.findIndex((game) => game.id === roomCode);

  return { game, index };
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

      const { game, index: gameIndex } = getGameInfo(roomCode);
      let newGame = game;
      if (game) {
        newGame = joinGame({ game, player });
        games[gameIndex] = newGame;
      } else {
        newGame = createNewGame({ player, roomCode });
        games.push(newGame);
      }

      ws.subscribe(`room-${roomCode}`);
      server.publish(
        `room-${roomCode}`,
        JSON.stringify({ type: Messages.UPDATE_CLIENT, data: newGame }),
      );
    },
    message(ws, message) {
      if (typeof message !== "string") return;
      // const { type, data } = JSON.parse(message);
    },
    close(ws) {
      const { roomCode, player } = ws.data;
      ws.unsubscribe(`room-${roomCode}`);

      const { game, index } = getGameInfo(roomCode);
      if (!game) return;

      // Deep copy the game
      const modifiedGame = structuredClone(game);

      modifiedGame.players = game.players.map((item) => {
        if (item.id === player.id) {
          return {
            ...item,
            active: false,
          };
        }
        return item;
      });

      // TODO: We should also transfer the ADMIN role if there isn't one

      games[index] = modifiedGame;
      server.publish(
        `room-${roomCode}`,
        JSON.stringify({ type: Messages.UPDATE_CLIENT, data: modifiedGame }),
      );
    },
  },
});

console.log(`Server listening on ${server.hostname}:${server.port}`);
