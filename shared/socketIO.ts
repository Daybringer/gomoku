import { GameSettingsIdless } from "../shared/interfaces/gameSettings.interface";
import { EndingType, Opening, Player, Position, Symbol } from "./types";

export enum SocketIOEvents {
  //Search
  SearchRankedGame = "searchRankedGame",
  GameCreated = "gameCreated",
  //General
  UpdateActiveUsers = "updateActiveUsers",
  JoinGame = "joinGame",
  InvalidRoomID = "invalidRoomID",
  GameStarted = "gameStarted",
  StonePlaced = "stonePlaced",
  GameClick = "gameClick",
  GameEnded = "gameEnded",
  TimeCalibration = "timeCalibration",
  SendMessage = "sendMessage",
  RecieveMessage = "recieveMessage",
  ToClientSwapPickGameStone = "toClientSwapPickGameStone",
  ToServerSwapPickGameStone = "toServerSwapPickGameStone",
  SwapGameStonePicked = "gameStonePicked",
  //Custom specials
  CreateCustomWaiting = "createCustomWaiting",
  CustomWaitingCreated = "customWaitingCreated",
  CustomRoomJoined = "customRoomJoined",
  InvalidCustomRoom = "invalidCustomRoom",
  CustomRoomRedirectToGame = "customRoomRedirectToGame",
  AskForRematch = "askForRematch",
  RedirectToCustomRematch = "redirectToCustomRematch",
}

export class GameEndedDTO {
  readonly endingType: EndingType;
  readonly winner?: Player;
  readonly winningCombination?: Array<[number, number]>;
  readonly userIDToEloDiff?: Record<number, number>;
}

export class SearchRankedGameDTO {
  readonly jwtToken: string;
}
export class ToClientSwapPickGameStoneDTO {
  readonly pickingPlayer: Player;
}

export class SendMessageDTO {
  readonly roomID: string;
  readonly message: string;
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
  readonly userID?: number;
}

export class UpdateActiveUsersDTO {
  readonly activeUsers: number;
}
export class GameStartedEventDTO {
  readonly gameSettings: GameSettingsIdless;
  readonly startingPlayer: Player;
  readonly players: Player[];
}

export class StonePlacedDTO {
  readonly position: Position;
  readonly players: Player[];
  readonly currentPlayer: Player;
}

export class AskForRematchDTO {
  readonly oldRoomID: string;
  readonly settings: GameSettingsIdless;
}

export class RedirectToCustomRematchDTO {
  readonly askeeSocketID: string;
  readonly waitingRoomID: string;
}

export class CreateCustomDTO {
  readonly gameSettings: GameSettingsIdless;
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
