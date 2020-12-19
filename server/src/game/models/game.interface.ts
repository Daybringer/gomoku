import { UserInterface as User } from '../../users/models/user.interface';

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
  players?: User[];
  date?: Date[];
  type?: gameType;
  eloDifference?: number;
  time?: number;
  winner?: User | null;
  typeOfWin?: typeOfWin;
  finalState?: number[][];
}
