import { User } from './user.interface';

export interface UserStatistics {
  id: number;
  leaderboardPosition: number;
  rankedWon: number;
  rankedLost: number;
  rankedTied: number;
  quickWon: number;
  quickLost: number;
  quickTied: number;
}
