import { GameConstraints } from "../types";

export class GetGamesByUserIDDTO {
  userID: number;
  skip: number;
  take: number;
  constraints: GameConstraints;
}
