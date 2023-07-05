import { Game } from "./game.interface";
import { User } from "./user.interface";

export interface PlayerGameProfile {
  id: number;
  createdAt: Date;
  timeLeft?: number;
  eloDelta?: number;
  game: Game;
  user: User;
}
