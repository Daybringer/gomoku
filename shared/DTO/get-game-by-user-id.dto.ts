import { EndingType, GameType } from 'shared/types';

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
