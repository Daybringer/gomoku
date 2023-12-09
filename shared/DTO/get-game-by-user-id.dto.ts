import { GameConstraints } from '../types';

export class GetGamesByUserIDDTO {
  userID: number;
  orderFromNewest?: boolean;
  skip: number;
  take: number;
  constraints: GameConstraints;
}
