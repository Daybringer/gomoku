import { User } from "./interfaces/user.interface";
import { ProfileIcon } from "./icons";

//TODO remove position and use Turn
type Position = [number, number];
/**
 * x,y position in this order
 * X: column
 * Y: row
 */
type Turn = [number, number];

enum Symbol {
  NotTaken,
  Circle,
  Cross,
}
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

enum OpeningPhase {
  Place3 = "place3",
  PickGameStone = "pickGameStone",
  Done = "done",
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
  playerSymbol: Symbol;
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

interface GameConstraints {
  allowedEndingTypes?: EndingType[];
  allowedGameTypes?: GameType[];
  allowedAmIWinner?: boolean[];
}

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
  OpeningPhase,
  Player,
  Time,
  Symbol,
  GameConstraints,
};
