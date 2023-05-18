import { GameBoard, LoginStrategy } from "../types";
import { Achievement } from "../achievements";
import { ProfileIcon } from "../icons";

export interface User {
  id: number;
  username: string;
  socialID?: string;
  email: string;
  password?: string;
  mailVerificationCode?: string;
  createdAt?: Date;
  admin?: boolean;
  premium?: boolean;
  strategy: LoginStrategy;
  verified?: boolean;
  elo?: number;
  credit: number;
  nameChangeTokens?: number;
  achievements: Achievement[];
  playerColor: string;
  enemyColor: string;
  gameBoard: GameBoard;
  selectedIcon: ProfileIcon;
  availableIcons: ProfileIcon[];
  rankedWon: number;
  rankedLost: number;
  rankedTied: number;
  quickWon: number;
  quickLost: number;
  quickTied: number;
}
