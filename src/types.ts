export enum Role {
  ADMIN = "ADMIN",
  USER = "PLAYER",
}

export interface Player {
  id: string;
  name: string;
  active: boolean;
  role: Role;
}

export interface PlayerScore {
  player: string;
  score: number;
}

export interface Item {
  id: string;
  name: string;
  link: string;
  createdBy: string;
  score: PlayerScore[];
}

export enum Scene {
  MAIN = "main",
  LOBBY = "lobby",
  GAME = "game",
  RESULT = "result",
}

export enum Messages {
  UPDATE_CLIENT = "updateClient",
  UPDATE_SERVER = "updateServer",
  UPDATE_ROOM_NAME = "updateRoomName",
  START_GAME = "startGame",
  ADD_SCORE = "addScore",
  ADD_ITEM = "addItem",
  DELETE_ITEM = "deleteItem",
  ERROR = "error",
}

export type ConnectionData = {
  player: {
    id: string;
    name: string;
  };
  roomCode: string;
};

export type State = {
  actualItem: number;
};

export interface Game {
  id?: string;
  name?: string;
  scene: Scene;
  players: Player[];
  list: Item[];
  state: State;
}
