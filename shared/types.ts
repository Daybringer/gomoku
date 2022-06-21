/* eslint-disable */
type position = [number, number];
interface GameClickDTO {
  roomID: string;
  position: position;
}

interface JoinGameDTO {
  roomID: string;
  logged: boolean;
  username: string;
}

enum GameEvents {
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
}

enum GameType {
  Quick,
  Ranked,
  Custom,
}

enum TypeOfWin {
  Combination,
  Time,
  Surrender,
  Tie,
}

enum GameBoard {
  Normal,
  Traditional,
  Modern,
}

interface Colors {
  playerColor: string;
  enemyColor: string;
}

enum LoginStrategy {
  Local,
  Google,
  Facebook,
}

enum SearchEvents {
  GameCreated = "gameCreated",
}

// interface SocketEvents {
//   GameEvents: GameEvents;
//   SearchEvents: SearchEvents;
// }

export {
  position,
  GameClickDTO,
  GameEvents,
  SearchEvents,
  GameType,
  TypeOfWin,
  JoinGameDTO,
  LoginStrategy,
  Colors,
  GameBoard,
};
