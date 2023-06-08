import { GameType, EndingType, Turn, Opening } from "../types";
import { ExpandedPlayerGameProfile } from "./playerGameProfile.interface";

// Propagate
export interface Game {
  id: number;
  type: GameType;
  createdAt: Date;
  typeOfWin: EndingType;
  finalState: number[][];
  turnHistory: Turn[];
  playerGameProfileIDs: number[];
  winnerGameProfileID?: number;
  startingPlayerGameProfileID: number;
  afterSwap1StartingPlayerGameProfileID?: number;
  afterSwap2StartingPlayerGameProfileID?: number;
  // Settings
  openingType: Opening;
  timeLimitInSeconds: number;
  hasTimeLimit: boolean;
  doesOverlineCount: boolean;
  boardSize: number;
  winningLineSize: number;
}

export interface ExpandedGame extends Game {
  // PlayergGameProfileID to PlayerGameProfile
  expandedPlayerGameProfiles: Record<number, ExpandedPlayerGameProfile>;
}
