import {
  Role,
  Scene,
  type ConnectionData,
  type Game,
  type Player,
} from "../src/types";

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
    state: false,
  };
};

export const joinGame = ({
  game,
  player,
}: {
  game: Game;
  player: ConnectionData["player"];
}) => {
  const modifiedGame = structuredClone(game);

  const newPlayer: Player = {
    id: player.id.toString(),
    name: player.name,
    active: true,
    role: Role.USER,
  };
  modifiedGame.players.push(newPlayer);

  return modifiedGame;
};
