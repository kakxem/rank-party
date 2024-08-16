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

  return { game: structuredClone(game), index };
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

      const { game, index } = getGameInfo(roomCode);
      let newGame = game;
      if (game) {
        newGame = joinGame({ game, player });
        games[index] = newGame;
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

      const { roomCode } = ws.data;
      const { type, data } = JSON.parse(message);
      const { game, index } = getGameInfo(roomCode);

      if (type === Messages.UPDATE_ROOM_NAME) {
        const { newName } = data;

        if (game) {
          game.name = newName;
          games[index] = game;
          server.publish(
            `room-${roomCode}`,
            JSON.stringify({ type: Messages.UPDATE_CLIENT, data: game }),
          );
        }
      }

      if (type === Messages.ADD_ITEM) {
        const { name, link } = data;

        if (game) {
          const isDuplicate = game.list.some(
            (item) => item.name === name || item.link === link,
          );
          if (isDuplicate) return;

          game.list.push({ id: `${name}-${link}`, name, link, score: [] });
          games[index] = game;
          server.publish(
            `room-${roomCode}`,
            JSON.stringify({ type: Messages.UPDATE_CLIENT, data: game }),
          );
        }
      }
    },
    close(ws) {
      const { roomCode, player } = ws.data;
      const { game, index } = getGameInfo(roomCode);
      if (!game) return;

      game.players = game.players.map((item) => {
        if (item.id === player.id) {
          return {
            ...item,
            active: false,
          };
        }
        return item;
      });

      // TODO: We should also transfer the ADMIN role if there isn't one

      games[index] = game;
      ws.unsubscribe(`room-${roomCode}`);
      server.publish(
        `room-${roomCode}`,
        JSON.stringify({ type: Messages.UPDATE_CLIENT, data: game }),
      );
    },
  },
});

console.log(`Server listening on ${server.hostname}:${server.port}`);
