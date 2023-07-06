import { Opening } from '../types';

export interface GameSettings {
  id: number;
  openingType: Opening;
  hasTimeLimit: boolean;
  timeLimitInSeconds?: number;
  doesOverlineCount: boolean;
  boardSize: number;
  winningLineSize: number;
}
