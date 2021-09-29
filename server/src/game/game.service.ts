import { Injectable } from '@nestjs/common';
import {
  QuickGame,
  RankedGame,
  Player,
  GameState,
  WinCondition,
  GameType,
} from './game.class';

@Injectable()
export class GameService {
  quickGameRooms: { [id: string]: QuickGame } = {};
  // test object
  rankedGameRooms: { [id: string]: RankedGame } = {};

  gameRooms = [this.quickGameRooms, this.rankedGameRooms];

  private generateRoomID(...rooms: Object[]) {
    const IDLength = 6;
    for (let x = 0; x < 100; x++) {
      let randID = Math.random().toString(36).substr(2, IDLength).toUpperCase();

      let isTaken = false;

      rooms.forEach((room) => {
        if (room.hasOwnProperty(randID)) {
          isTaken = true;
        }
      });

      if (!isTaken) {
        return randID;
      }
    }
    throw 'generateRoomID overlooped';
  }

  generateQuickGameRoom(): { game: QuickGame | RankedGame; roomID: string } {
    const roomID = this.generateRoomID(...this.gameRooms);
    const newQuickGameRoom = new QuickGame();
    this.quickGameRooms[roomID] = newQuickGameRoom;
    return { game: newQuickGameRoom, roomID };
  }

  roomExists(roomID: string): boolean {
    let roomExists = false;

    this.gameRooms.forEach((gameDictionary) => {
      if (gameDictionary.hasOwnProperty(roomID)) roomExists = true;
    });

    return roomExists;
  }

  findGame(roomID: string): QuickGame | RankedGame {
    let game;
    this.gameRooms.forEach((anyGameRooms) => {
      if (anyGameRooms.hasOwnProperty(roomID)) {
        game = anyGameRooms[roomID];
        return;
      }
    });
    if (game) return game;
    throw 'GameDoesNotExist';
  }

  isPlayersTurn(socketID: string, roomID: string): boolean {
    return this.findGame(roomID).getPlayerOnTurn().socketID === socketID;
  }

  placeStone(
    position: [number, number],
    socketID: string,
    roomID: string,
  ): void {
    const game = this.findGame(roomID);
    if (game.isStarted()) {
      if (game.gameboard[position[0]][position[1]] === 0) {
        game.gameboard[position[0]][position[1]] =
          game.startingPlayer.socketID === socketID ? 1 : 2;
        game.saveTurn(position);
      } else {
        throw 'takenPosition';
      }
    } else {
      throw 'gameNotRunning';
    }
  }

  saveTimeoutHandle(roomID: string, saveTimeoutHandle: number): void {
    const game = this.findGame(roomID);
    game.timeoutHandleID = saveTimeoutHandle;
  }

  getTimeoutHandle(roomID: string): number {
    return this.findGame(roomID).timeoutHandleID;
  }

  // getPlayersTimes(roomID: string): { [socketID: string]: number } {
  //   const playersTimes = {};
  //   const players = this.findGame(roomID).players;
  //   playersTimes[players[0].socketID] = players[0].secondsLeft;
  //   playersTimes[players[1].socketID] = players[1].secondsLeft;
  //   return playersTimes;
  // }

  switchTime(roomID: string) {
    const game = this.findGame(roomID);
    const timeNow = Date.now();
    const player = game.getPlayerOnTurn();
    console.log(player.secondsLeft);
    player.secondsLeft -= Math.floor(
      (timeNow - game.lastCalibrationTimestamp) / 1000,
    );

    console.log(player.secondsLeft);
    game.lastCalibrationTimestamp = timeNow;
    return Math.floor(timeNow / 1000);
  }

  // Util functions; might move gateway logic here

  public iterateRound(roomID: string): void {
    this.findGame(roomID).iterateRound();
  }

  getGameInfo(roomID: string) {
    const { players, startingPlayer, timeLimitInSeconds } =
      this.findGame(roomID);
    return { players, startingPlayer, timeLimitInSeconds };
  }

  isStarted(roomID: string): boolean {
    return this.findGame(roomID).isStarted();
  }

  playerOnTurn(roomID: string): Player {
    return this.findGame(roomID).getPlayerOnTurn();
  }

  startGame(roomID: string): Player {
    const game = this.findGame(roomID);
    game.setGameState(GameState.running);
    game.lastCalibrationTimestamp = Date.now() + 5000;
    return game.selectRandomStartingPlayer();
  }

  checkWin(position: number[], roomID: string) {
    const game = this.findGame(roomID);
    const round = game.round;
    const gamePlan = game.gameboard;

    const [xPos, yPos] = position;
    const tile = round % 2 ? 1 : 2;
    let horizont = 0;
    let vertical = 0;
    let diagonalR = 0;
    let diagonalL = 0;
    for (let x = -4; x < 5; x++) {
      // * Horizontal check
      if (xPos + x >= 0 && xPos + x <= 14) {
        if (gamePlan[xPos + x][yPos] === tile) {
          horizont++;
        } else {
          horizont = 0;
        }
      }
      if (yPos + x >= 0 && yPos + x <= 14) {
        if (gamePlan[xPos][yPos + x] === tile) {
          vertical++;
        } else {
          vertical = 0;
        }
      }
      if (yPos + x >= 0 && yPos + x <= 14 && xPos + x >= 0 && xPos + x <= 14) {
        if (gamePlan[xPos + x][yPos + x] === tile) {
          diagonalR++;
        } else {
          diagonalR = 0;
        }
      }
      if (yPos + x >= 0 && yPos + x <= 14 && xPos - x >= 0 && xPos - x <= 14) {
        if (gamePlan[xPos - x][yPos + x] === tile) {
          diagonalL++;
        } else {
          diagonalL = 0;
        }
      }
      if (horizont >= 5 || vertical >= 5 || diagonalL >= 5 || diagonalR >= 5) {
        return GameState.win;
      }
    }
    if (horizont >= 5 || vertical >= 5 || diagonalL >= 5 || diagonalR >= 5) {
      return GameState.win;
    } else if (round === 225) {
      return GameState.tie;
    } else {
      return GameState.running;
    }
  }

  endGame(winCondition: WinCondition, isTie: boolean, roomID: string): void {
    const game = this.findGame(roomID);
    game.setGameState(isTie ? GameState.tie : GameState.win);
    game.winCondition = winCondition;
  }

  addPlayer(
    roomID: string,
    socketID: string,
    logged: boolean,
    username: string,
  ): void {
    const player: Player = { socketID, username, logged };
    const game = this.findGame(roomID);
    if (!game.isFull()) game.addPlayer(player);
    if (game.isFull() && !game.isStarted()) this.startGame(roomID);
  }
}
