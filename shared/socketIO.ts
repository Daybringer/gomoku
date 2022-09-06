import { Socket } from 'socket.io';
import { Opening, Player, Position } from './types';

export enum SocketIOEvents {
  UpdateActiveUsers = 'updateActiveUsers',
  JoinGame = 'joinGame',
  InvalidRoomID = 'invalidRoomID',
  GameStarted = 'gameStarted',
  StonePlaced = 'stonePlaced',
  GameClick = 'gameClick',
  GameEndedByDisconnect = 'gameEndedByDisconnect',
  GameEndedByCombination = 'gameEndedByCombination',
  GameEndedByTimeout = 'gameEndedByTimout',
  GameEndedByTie = 'gameEndedByTie',
  TimeCalibration = 'timeCalibration',
  SendMessage = 'sendMessage',
  RecieveMessage = 'recieveMessage',
  //Custom specials
  CreateCustomWaiting = 'createCustomWaiting',
  CustomWaitingCreated = 'customWaitingCreated',
  CustomRoomJoined = 'customRoomJoined',
  CustomRoomRedirectToGame = 'customRoomRedirectToGame',
}

abstract class GameEndedDTO {
  readonly winner: Player;
}

export class GameEndedByDisconnectDTO extends GameEndedDTO {}

export class GameEndedByTimeoutDTO extends GameEndedDTO {}

export class GameEndedByCombinationDTO extends GameEndedDTO {}

export class TimeCalibrationDTO {
  readonly players: Player[] = [];
}

export class GameClickDTO {
  readonly roomID: string;
  readonly position: Position;
}

export class JoinGameDTO {
  readonly roomID: string;
  readonly logged: boolean;
  readonly userID: number;
}

export class UpdateActiveUsersDTO {
  readonly activeUsers: number;
}
export class GameStartedEventDTO {
  readonly timeLimitInSeconds: number;
  readonly startingPlayerSocketID: string;
  readonly players: Player[];
}

export class StonePlacedDTO {
  readonly position: Position;
  readonly players: Player[];
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
