import { ProfileIcon } from "./icons";
import { Opening } from "./types";

export enum SocketIOEvents {
  JoinGame = "joinGame",
  InvalidRoomID = "invalidRoomID",
  GameStarted = "gameStarted",
  StonePlaced = "stonePlaced",
  GameClick = "gameClick",
  GameEndedByDisconnect = "gameEndedByDisconnect",
  GameEndedByCombination = "gameEndedByCombination",
  GameEndedByTimeout = "gameEndedByTimout",
  GameEndedByTie = "gameEndedByTie",
  TimeCalibration = "timeCalibration",
  SendMessage = "sendMessage",
  RecieveMessage = "recieveMessage",
  //Custom specials
  CreateCustomWaiting = "createCustomWaiting",
  CustomWaitingCreated = "customWaitingCreated",
  CustomRoomJoined = "customRoomJoined",
  CustomRoomRedirectToGame = "customRoomRedirectToGame",
}

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

export class CreateCustomDTO {
  readonly hasTimeLimit: boolean;
  readonly timeLimitInSeconds: number;
  readonly opening: Opening;
}

export class CustomCreatedDTO {
  readonly roomID: string;
}

export class CustomRoomJoinedDTO {
  readonly waitingRoomID: string;
}

export class CustomRoomRedirectToGameDTO {
  readonly roomID: string;
}
