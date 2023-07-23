import { Opening } from "../types";

export interface GameSettings extends GameSettingsIdless {
  id: number;
}

export interface GameSettingsIdless {
  openingType: Opening;
  hasTimeLimit: boolean;
  timeLimitInSeconds?: number;
  doesOverlineCount: boolean;
  boardSize: number;
  winningLineSize: number;
}
