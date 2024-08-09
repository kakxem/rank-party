export enum Role {
  ADMIN = "ADMIN",
  USER = "PLAYER",
}

export interface Player {
  id: string;
  name: string;
  role: Role;
}

export interface PlayerScore {
  player: Player;
  score: number;
}

export interface Item {
  id: string;
  name: string;
  link: string;
  score: PlayerScore[];
}

export enum Scene {
  MAIN = "main",
  LOBBY = "lobby",
  GAME = "game",
  RESULT = "result",
}

export interface Game {
  id?: string;
  name?: string;
  scene: Scene;
  players: Player[];
  list: Item[];
  state: boolean;
}
