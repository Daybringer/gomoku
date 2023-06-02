import { GameType, EndingType, Turn } from "../types";
import { ExpandedPlayerGameProfile } from "./playerGameProfile.interface";

// Propagate
export interface Game {
  id: number;
  playerGameProfileIDs: number[];
  createdAt: Date;
  type: GameType;
  winnerGameProfileID?: number;
  typeOfWin: EndingType;
  finalState: number[][];
  turnHistory: Turn[];
  startingPlayerGameProfileID: number;
  afterSwap1StartingPlayerGameProfileID?: number;
  afterSwap2StartingPlayerGameProfileID?: number;
}

export interface ExpandedGame extends Game {
  // PlayergGameProfileID to PlayerGameProfile
  expandedPlayerGameProfiles: Record<number, ExpandedPlayerGameProfile>;
}
