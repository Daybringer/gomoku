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
  Quick = "quick",
  Ranked = "ranked",
  Custom = "custom",
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
  JoinGameDTO,
};
