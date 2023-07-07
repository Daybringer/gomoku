import { GameBoard } from "../types";
import { User } from "./user.interface";
import { ProfileIcon } from "../icons";

export interface UserSettings {
  id: number;
  playerColor: string;
  opponentColor: string;
  gameBoard: GameBoard;
  selectedIcon: ProfileIcon;
  availableIcons: ProfileIcon[];
}
