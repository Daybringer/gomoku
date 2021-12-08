/* eslint-disable */
type position = [number, number];
interface GameClickDTO {
  roomID: string;
  position: position;
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

export { position, GameClickDTO, GameEvents, SearchEvents, GameType };
