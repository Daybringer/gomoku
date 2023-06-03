import { EndingType, GameType } from '../types';

export class GetGamesByUserIDDTO {
  userID: number;
  skip: number;
  take: number;
  constraints: {
    allowedEndingTypes?: EndingType;
    allowedGameTypes?: GameType[];
    amIWinner?: boolean;
  };
}
