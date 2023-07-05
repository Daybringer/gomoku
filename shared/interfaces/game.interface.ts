import { GameType, EndingType, Turn } from "../types";
import { GameSettings } from "./gameSettings.interface";
import { PlayerGameProfile } from "./playerGameProfile.interface";

// Propagate
export interface Game {
  id: number;
  createdAt: Date;
  type: GameType;
  typeOfWin: EndingType;
  turnHistory: Turn[];
  winningCombination?: Turn[];
  playerGameProfiles: PlayerGameProfile[];
  winner?: PlayerGameProfile;
  startingPlayer: PlayerGameProfile;
  afterSwapStartingPlayer?: PlayerGameProfile;
  gameSettings: GameSettings;
}
