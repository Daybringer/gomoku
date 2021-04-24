import { UserEntity } from 'src/users/models/user.entity';

enum gameType {
  RANKED = 'ranked',
  QUICK = 'quick',
  CUSTOM = 'custom',
}

enum typeOfWin {
  COMBINATION = 'combination',
  TIME = 'time',
  SURRENDER = 'surrender',
  TIE = 'tie',
}

export interface GameInterface {
  id?: number;
  players?: UserEntity[];
  date?: Date[];
  type?: gameType;
  eloDifference?: number;
  time?: number;
  winner?: UserEntity | null;
  typeOfWin?: typeOfWin;
  finalState?: number[][];
}
