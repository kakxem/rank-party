import type { UserData } from ".";
import { Role, Scene, type Game, type Player } from "../src/types";

export const createNewGame = ({
  playerName,
  roomCode,
}: Omit<UserData, "pathname">): Game => {
  const player: Player = {
    id: "0",
    name: playerName,
    role: Role.ADMIN,
  };

  return {
    id: roomCode,
    name: "Random",
    scene: Scene.LOBBY,
    players: [player],
    list: [],
    state: false,
  };
};

export const joinGame = ({
  game,
  playerName,
}: {
  game: Game;
  playerName: string;
}) => {
  const modifiedGame = { ...game };

  const player: Player = {
    // ! This will cause many problems if someone leaves the game
    id: game.players.length.toString(),
    name: playerName,
    role: Role.USER,
  };
  modifiedGame.players.push(player);

  return modifiedGame;
};
