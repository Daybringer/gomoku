import { LoginStrategy } from "../types";
import { Game } from "./game.interface";
import { PlayerGameProfile } from "./playerGameProfile.interface";

export interface User {
  id: number;
  username: string;
  socialID: string;
  email: string;
  password: string;
  mailVerificationCode?: string;
  createdAt: Date;
  admin: boolean;
  verified: boolean;
  strategy: LoginStrategy;
  elo: number;
  credit: number;
  nameChangeTokens: number;
  userConfig: [];
  gameProfiles: PlayerGameProfile[];
  games: Game[];
}
