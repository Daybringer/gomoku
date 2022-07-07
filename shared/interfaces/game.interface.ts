import { GameType, EndingType, Turn } from "../types";

// Propagate
export interface Game {
  id?: number;
  playerProfilesIDs?: number[];
  createdAt?: Date;
  type?: GameType;
  winnerGameProfileID?: number;
  typeOfWin?: EndingType;
  finalState?: number[][];
  turnHistory: Turn[];
  startingPlayerGameProfileID?: number;
  afterSwap1StartingPlayerGameProfileID?: number;
  afterSwap2StartingPlayerGameProfileID?: number;
}

export interface FilledGame extends Game {
  dateString: string;
  myDelta: number;
  myUsername: string;
  myID: number;
  myRemainingTime: number;
  enemyRemainingTime: number;
  enemyID?: number;
  enemyUsername: string;
  enemyLogged: boolean;
  win: boolean;
}
