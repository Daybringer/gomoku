import { ProfileIcon } from "./icons";

export type GameStartedEventPlayerInfo = {
  logged: boolean;
  secondsLeft: number;
  username: string;
  userID: number;
  profileIcon?: ProfileIcon;
};

export class GameStartedEventDTO {
  readonly timeLimitInSeconds: number;
  readonly startingPlayerSocketID: string;
  readonly players: Record<string, GameStartedEventPlayerInfo>;
}
