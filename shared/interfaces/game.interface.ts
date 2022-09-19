import { GameType, EndingType, Turn } from '../types';

// Propagate
export interface Game {
  id?: number;
  playerGameProfilesIDs?: number[];
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
  me: { id: number; username: string; remainingTime: number; delta: number };
  opponent: {
    logged: boolean;
    id: number;
    username: string;
    remainingTime: number;
    delta: number;
  };
  win: boolean;
}
