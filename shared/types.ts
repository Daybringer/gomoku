import { User } from "./interfaces/user.interface";
import { ProfileIcon } from "./icons";

/* eslint-disable */
type Position = [number, number];
type Symbol = 0 | 1 | 2;

/**
 * Has to have string literals, because enum values are compared with URL params
 */
enum GameType {
  Quick = "quick",
  Ranked = "ranked",
  Custom = "custom",
}

enum EndingType {
  Combination,
  Time,
  Surrender,
  Tie,
}

enum GameState {
  Waiting = "WAITING",
  Running = "RUNNING",
  Ended = "ENDED",
}

enum Opening {
  Standard = "STANDARD",
  Swap1 = "SWAP1",
  Swap2 = "SWAP2",
}

type Time = 3 | 5 | 10 | "infinite";

interface Player {
  socketID: string;
  userID: number;
  logged: boolean;
  profileIcon: ProfileIcon;
  username: string;
  /** in miliseconds */
  timeLeft: number;
}

enum GameBoard {
  Standard = "standard",
  Classic = "classic",
  Modern = "modern",
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
  Position,
  SearchEvents,
  GameType,
  EndingType,
  LoginStrategy,
  Colors,
  GameBoard,
  AuthenticationPayload,
  Turn,
  GameState,
  Opening,
  Player,
  Time,
  Symbol,
};
