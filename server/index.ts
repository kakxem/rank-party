import Bun from "bun";
import { Messages, type Game } from "../src/types";
import { createNewGame, joinGame } from "./actions";

export interface UserData {
  roomCode?: string;
  playerName: string;
  pathname: string;
}

const games: Game[] = [];

const getUserData = (req: Request) => {
  const url = new URL(req.url);
  let roomCode = url.searchParams.get("roomCode");
  const playerName = url.searchParams.get("playerName");

  if (!roomCode) {
    roomCode = Math.random().toString(36).slice(2, 8);
  }
  return { roomCode, playerName };
};

const server = Bun.serve<UserData>({
  port: 5000,
  fetch(req, server) {
    const { pathname } = new URL(req.url);
    const { roomCode, playerName } = getUserData(req);

    if (pathname === "/join") {
      const game = games.find((game) => game.id === roomCode);

      if (!game) {
        console.log("game not found");
        return new Response(null, {
          status: 404,
        });
      }
    }

    server.upgrade(req, {
      data: { roomCode, playerName },
    });
  },
  websocket: {
    idleTimeout: 10,
    open(ws) {
      const { roomCode, playerName } = ws.data;

      let game = games.find((game) => game.id === roomCode);
      if (game) {
        const gameIndex = games.findIndex((game) => game.id === roomCode);
        game = joinGame({ game, playerName });
        games[gameIndex] = game;
      } else {
        game = createNewGame({ playerName, roomCode });
        games.push(game);
      }

      ws.subscribe(`room-${roomCode}`);
      server.publish(
        `room-${roomCode}`,
        JSON.stringify({ type: Messages.UPDATE_CLIENT, data: game }),
      );
    },
    message(ws, message) {
      if (typeof message !== "string") return;
      // const { type, data } = JSON.parse(message);
    },
    close(ws) {
      const { roomCode, playerName } = ws.data;
      console.log("close", roomCode, playerName);
      // ws.unsubscribe(`room-${roomCode}`);
      // server.publish(
      //   `room-${roomCode}`,
      //   JSON.stringify({ type: "leave", data: { roomCode, playerName } }),
      // );
    },
  },
});

console.log(`Server listening on ${server.hostname}:${server.port}`);
