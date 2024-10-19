import type * as Party from "partykit/server";
import {
  Messages,
  Role,
  Scene,
  type ConnectionData,
  type Game,
  type Player,
} from "../src/types.ts";

export const createNewGame = ({ player }: ConnectionData): Game => {
  const newPlayer: Player = {
    id: player.id.toString(),
    name: player.name,
    active: true,
    role: Role.ADMIN,
  };

  return {
    name: `${player.name}'s game`,
    scene: Scene.LOBBY,
    players: [newPlayer],
    list: [],
    state: {
      actualItem: 0,
      executingTimeout: false,
    },
    settings: {
      timeout: 3,
    },
  };
};

export const joinGame = ({
  game,
  player,
}: {
  game: Game;
  player: ConnectionData["player"];
}) => {
  const oldPlayer = game.players.find(
    (item) => item.id === player.id.toString(),
  );
  if (oldPlayer) {
    const indexPlayer = game.players.indexOf(oldPlayer);
    oldPlayer.active = true;
    oldPlayer.name = player.name;
    game.players.splice(indexPlayer, 1, oldPlayer);

    return game;
  }

  const newPlayer: Player = {
    id: player.id.toString(),
    name: player.name,
    active: true,
    role: Role.USER,
  };
  game.players.push(newPlayer);

  return game;
};

export const sendError = ({
  conn,
  message,
}: {
  conn: Party.Connection;
  message: string;
}) => {
  conn.send(JSON.stringify({ type: Messages.ERROR, data: { message } }));
};
