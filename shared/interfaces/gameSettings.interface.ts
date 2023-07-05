import { Opening } from "shared/types";

export interface GameSettings {
  id: number;
  openingType: Opening;
  hasTimeLimit: boolean;
  timeLimitInSeconds?: number;
  doesOverlineCount: number;
  boardSize: number;
  winningLineSize: number;
}
