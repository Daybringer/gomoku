import { Game } from "./game.interface";
import { User } from "./user.interface";

export interface PlayerGameProfile {
  id: number;
  user: User;
  timeLeft: number;
  game: Game;
}
