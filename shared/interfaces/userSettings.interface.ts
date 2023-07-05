import { GameBoard } from "shared/types";
import { User } from "./user.interface";
import { ProfileIcon } from "shared/icons";

export interface UserSettings {
  id: number;
  user: User;
  playerColor: string;
  opponentColor: string;
  gameBoard: GameBoard;
  selectedIcon: ProfileIcon;
  availableIcons: ProfileIcon[];
}
