import { ProfileIcon } from '../icons';

export interface PlayerGameProfile {
  id: number;
  gameID?: number;
  createdAt?: Date;
  userID?: number;
  timeLeft: number;
  eloDelta?: number;
}

export interface ExpandedPlayerGameProfile extends PlayerGameProfile {
  username?: string;
  profileIcon?: ProfileIcon;
  eloDelta?: number;
}
