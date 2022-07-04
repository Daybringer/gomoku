import { GameType, EndingType, Turn } from "../types";
import { PlayerGameProfile } from "./playerGameProfile.interface";

export interface Game {
  id?: number;
  playerProfiles?: PlayerGameProfile[];
  createdAt?: Date[];
  type?: GameType;
  eloDelta?: number;
  winnerID?: number;
  typeOfWin?: EndingType;
  finalState?: number[][];
  turnHistory: Turn[];
}
