import {
  Messages,
  Role,
  Scene,
  type ConnectionData,
  type Game,
  type Player,
} from "../src/types.ts";

export const createNewGame = ({ player, roomCode }: ConnectionData): Game => {
  const newPlayer: Player = {
    id: player.id.toString(),
    name: player.name,
    active: true,
    role: Role.ADMIN,
  };

  return {
    id: roomCode,
    name: "Change the room name",
    scene: Scene.LOBBY,
    players: [newPlayer],
    list: [],
    state: {
      actualItem: 0,
      executingTimeout: false,
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
  ws,
  message,
}: {
  ws: WebSocket;
  message: string;
}) => {
  ws.send(JSON.stringify({ type: Messages.ERROR, data: { message } }));
};
