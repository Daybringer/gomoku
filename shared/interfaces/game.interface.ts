import { GameType, TypeOfWin } from "../types";
import { User } from "./user.interface";

export interface Game {
  id?: number;
  players?: User[];
  date?: Date[];
  type?: GameType;
  eloDifference?: number;
  time?: number;
  winner?: User | null;
  typeOfWin?: TypeOfWin;
  finalState?: number[][];
}
