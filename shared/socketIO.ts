import { Opening, Player, Position, Symbol } from './types';

export enum SocketIOEvents {
  //Search
  SearchRankedGame = 'searchRankedGame',
  GameCreated = 'gameCreated',
  //General
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
  ToClientSwapPickGameStone = 'toClientSwapPickGameStone',
  ToServerSwapPickGameStone = 'toServerSwapPickGameStone',
  SwapGameStonePicked = 'gameStonePicked',
  //Custom specials
  CreateCustomWaiting = 'createCustomWaiting',
  CustomWaitingCreated = 'customWaitingCreated',
  CustomRoomJoined = 'customRoomJoined',
  InvalidCustomRoom = 'invalidCustomRoom',
  CustomRoomRedirectToGame = 'customRoomRedirectToGame',
}

abstract class GameEndedDTO {
  readonly winner: Player;
  readonly userIDToEloDiff?: Record<number, number>;
}

export class GameEndedByDisconnectDTO extends GameEndedDTO {}

export class GameEndedByTimeoutDTO extends GameEndedDTO {}

export class GameEndedByCombinationDTO extends GameEndedDTO {}
export class SearchRankedGameDTO {
  readonly jwtToken: string;
}
export class ToClientSwapPickGameStoneDTO {
  readonly pickingPlayer: Player;
}

export class ToServerSwapPickGameStoneDTO {
  readonly roomID: string;
  readonly pickedSymbol: Symbol;
}

export class SwapGameStonePickedDTO {
  readonly currentPlayer: Player;
  readonly players: Player[];
}

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
  readonly hasTimeLimit: boolean;
  readonly opening: Opening;
  readonly startingPlayer: Player;
  readonly players: Player[];
}

export class StonePlacedDTO {
  readonly position: Position;
  readonly players: Player[];
  readonly currentPlayer: Player;
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
