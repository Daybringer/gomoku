import { GameInterface as Game } from '../../game/models/game.interface';
import { IconInterface as Icon } from './icon.interface';
import { SocialBladeSkinInterface as SocialBladeSkin } from './socialBladeSkin.interface';

enum GameBoard {
  NORMAL = 'normal',
  TRADITIONAL = 'traditional',
  MODERN = 'modern',
}

interface colors {
  enemeyColor: string;
  playerColor: string;
}

export interface UserInterface {
  // UNIQUE
  UUID?: string;
  username?: string;
  email?: string;
  //   NOT UNIQUE
  googleID?: string;
  password?: string;
  date?: Date;
  // admin?:boolean;
  // elo?: number;
  // games?: Game[];
  // credit?: number;
  // gameBoard?: GameBoard;
  // colors?: colors;
  // selectedIcon?: Icon;
  // availableIcons?: Icon[];
  // selectedSocialBladeSkin?: SocialBladeSkin;
  // availableSocialBladeSkins?: SocialBladeSkin[];
}
