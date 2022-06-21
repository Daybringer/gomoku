import { User } from "./interfaces/user.interface";

/* eslint-disable */
type position = [number, number];
interface GameClickDTO {
  roomID: string;
  position: position;
}

interface JoinGameDTO {
  roomID: string;
  logged: boolean;
  username: string;
}

enum GameEvents {
  JoinGame = "joinGame",
  InvalidRoomID = "invalidRoomID",
  GameStarted = "gameStarted",
  StonePlaced = "stonePlaced",
  GameClick = "gameClick",
  GameEndedByDisconnect = "gameEndedByDisconnect",
  GameEndedByCombination = "gameEndedByCombination",
  GameEndedByTimeout = "gameEndedByTimout",
  GameEndedByTie = "gameEndedByTie",
  TimeCalibration = "timeCalibration",
  SendMessage = "sendMessage",
  RecieveMessage = "recieveMessage",
}

/**
 * Has to have string literals, because enum values are compared with URL params
 */
enum GameType {
  Quick = "quick",
  Ranked = "ranked",
  Custom = "custom",
}

enum TypeOfWin {
  Combination,
  Time,
  Surrender,
  Tie,
}

enum GameBoard {
  Normal,
  Traditional,
  Modern,
}

interface Colors {
  playerColor: string;
  enemyColor: string;
}

enum LoginStrategy {
  Local,
  Google,
  Facebook,
}

enum SearchEvents {
  GameCreated = "gameCreated",
}

interface AuthenticationPayload {
  user: User;
  payload: {
    type: string;
    token: string;
    refresh_token?: string;
  };
}

/**
 * x,y position in this order
 * X: column
 * Y: row
 */
type Turn = [number, number];

export {
  position,
  GameClickDTO,
  GameEvents,
  SearchEvents,
  GameType,
  TypeOfWin,
  JoinGameDTO,
  LoginStrategy,
  Colors,
  GameBoard,
  AuthenticationPayload,
  Turn,
};
