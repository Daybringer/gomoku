import { Injectable } from '@nestjs/common';

import {
  AnyGame,
  GameState,
  GameType,
  GameEnding,
  Player,
  QuickGame,
  RankedGame,
} from '../game.class';

@Injectable()
export class GameService {
  quickGameRooms: { [id: string]: QuickGame } = {};
  // test object
  rankedGameRooms: { [id: string]: RankedGame } = {};

  gameRooms = [this.quickGameRooms, this.rankedGameRooms];

  private generateRoomID(...rooms: Record<string, unknown>[]) {
    const IDLength = 6;

    for (let x = 0; x < 100; x++) {
      const randID = Math.random()
        .toString(36)
        .substr(2, IDLength)
        .toUpperCase();

      let isTaken = false;

      rooms.forEach((room) => {
        if (room.hasOwnProperty(randID)) {
          isTaken = true;
        }
      });

      if (!isTaken) {
        return randID;
      } else {
        throw 'generateRoomID overlooped';
      }
    }
  }

  printQuickGameRooms(): void {
    console.log(this.quickGameRooms);
  }

  generateQuickGameRoom(): { game: AnyGame; roomID: string } {
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
    let game = undefined;
    this.gameRooms.forEach((anyGameRooms) => {
      if (anyGameRooms.hasOwnProperty(roomID)) {
        game = anyGameRooms[roomID];
        return;
      }
    });
    return game;
  }

  isPlayersTurn(socketID: string, roomID: string): boolean {
    const game = this.findGame(roomID);
    if (game) {
      return game.getPlayerOnTurn().socketID === socketID;
    }
  }

  findGameBySocketID(socketID: string): { game: AnyGame; roomID: string } {
    let game: AnyGame = undefined;
    let roomID: string = '';

    this.gameRooms.forEach((anyGameRooms: { [id: string]: AnyGame }) => {
      for (const key in anyGameRooms) {
        anyGameRooms[key].players.forEach((player) => {
          if (player.socketID === socketID) {
            game = anyGameRooms[key];
            roomID = key;
          }
        });
      }
    });
    return { game, roomID };
  }

  placeStone(
    position: [number, number],
    socketID: string,
    roomID: string,
  ): void {
    const game = this.findGame(roomID);
    if (game) {
      if (game.isRunning()) {
        if (game.gameboard[position[0]][position[1]] === 0) {
          game.gameboard[position[0]][position[1]] =
            game.startingPlayer.socketID === socketID ? 1 : 2;
          game.saveTurn(position);
        } else {
          throw 'TakenPosition';
        }
      }
    }
  }

  saveTimeoutHandle(roomID: string, saveTimeoutHandle: NodeJS.Timeout): void {
    const game = this.findGame(roomID);
    game.timeoutHandleID = saveTimeoutHandle;
  }

  getTimeoutHandle(roomID: string): NodeJS.Timeout {
    return this.findGame(roomID).timeoutHandleID;
  }

  /**
   * Saves current timestamp and returns rest seconds of next player's time
   * @param roomID string
   * @returns number of rest eeconds
   */
  switchTime(roomID: string): number {
    const game = this.findGame(roomID);
    if (game) {
      const timeNow = Date.now();
      const player = game.getPlayerOnTurn();
      player.secondsLeft -= Math.floor(
        (timeNow - game.lastCalibrationTimestamp) / 1000,
      );

      game.lastCalibrationTimestamp = timeNow;
      console.log(game.getNextPlayerOnTurn().secondsLeft);
      return game.getNextPlayerOnTurn().secondsLeft;
    }
  }

  // Util functions; might move gateway logic here

  iterateRound(roomID: string): void {
    this.findGame(roomID).iterateRound();
  }

  getGameInfo(roomID: string) {
    const { players, startingPlayer, timeLimitInSeconds } =
      this.findGame(roomID);
    return { players, startingPlayer, timeLimitInSeconds };
  }

  isRunning(roomID: string): boolean {
    const game = this.findGame(roomID);
    return game ? game.isRunning() : false;
  }

  playerOnTurn(roomID: string): Player {
    const game = this.findGame(roomID);
    if (game) {
      return game.getPlayerOnTurn();
    }
  }

  startGame(roomID: string): Player {
    const game = this.findGame(roomID);
    if (game) {
      game.setGameState(GameState.Running);
      game.lastCalibrationTimestamp = Date.now() + 5000;
      return game.selectRandomStartingPlayer();
    }
  }

  checkWin(position: number[], roomID: string): GameEnding {
    const game = this.findGame(roomID);
    const round = game.round;
    const gamePlan = game.gameboard;

    const [xPos, yPos] = position;
    const tile = round % 2 ? 1 : 2;
    let horizont = 0;
    let vertical = 0;
    let diagonalR = 0;
    let diagonalL = 0;
    // FIXME replace constants with gameBoardsize equivalent
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
        return GameEnding.Combination;
      }
    }
    if (horizont >= 5 || vertical >= 5 || diagonalL >= 5 || diagonalR >= 5) {
      return GameEnding.Combination;
    } else if (round === 225) {
      return GameEnding.Tie;
    } else {
      return GameEnding.None;
    }
  }

  saveGame(game: AnyGame): void {
    //TODO implement saving logic
    console.log('Saving game logic => TODO');
  }

  endGame(
    gameEnding: GameEnding,
    roomID: string,
    winnerSocketID?: string,
  ): void {
    const game = this.findGame(roomID);
    if (game) {
      game.setGameState(GameState.Ended);
      game.setGameEnding(gameEnding);
      if (gameEnding !== GameEnding.Tie) {
        if (winnerSocketID) {
          game.setWinner(winnerSocketID);
        } else {
          throw 'None WinnerSocketID given';
        }
      }
      this.saveGame(game);
    }
  }

  // FIXME only works on two players
  endGameDisconnect(disconnecteeID: string, roomID: string) {
    const game = this.findGame(roomID);
    if (game) {
      game.setGameState(GameState.Ended);
      game.setGameEnding(GameEnding.Disconnect);
      game.setWinner(game.getOtherPlayersIDByFirstOnes(disconnecteeID));
      this.saveGame(game);
    }
  }

  addPlayer(
    roomID: string,
    socketID: string,
    logged: boolean,
    username: string,
  ): void {
    const player: Player = { socketID, username, logged };
    const game = this.findGame(roomID);
    if (game) {
      if (!game.isFull()) game.addPlayer(player);
      if (game.isFull() && !game.isRunning()) this.startGame(roomID);
      console.log(game.isRunning());
    }
  }

  removePlayer(roomID: string, socketID: string): void {
    if (roomID) {
      // TODO
    } else {
      // TODO
    }
  }
}
