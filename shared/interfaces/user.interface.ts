import { LoginStrategy } from '../types';
import { Achievement } from '../achievements';
import { UserStatistics } from './userStatistics.interface';
import { UserSettings } from './userSettings.interface';
import { PlayerGameProfile } from './playerGameProfile.interface';

export interface User {
  id: number;
  username: string;
  socialID?: string;
  email: string;
  password?: string;
  mailVerificationCode?: string;
  createdAt: Date;
  admin: boolean;
  premium: boolean;
  strategy: LoginStrategy;
  verified: boolean;
  elo: number;
  credit: number;
  nameChangeTokens: number;
  achievements: Achievement[];
  settings: UserSettings;
  statistics: UserStatistics;
  playerGameProfiles: PlayerGameProfile[];
}
