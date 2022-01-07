import { Injectable } from '@nestjs/common';
import {
  JoinGameDTO,
  GameEvents,
  SearchEvents,
  GameClickDTO,
} from 'gomoku-shared-types/';
import { Server, Socket } from 'socket.io';
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

  calibrateTimesAcrossClients(
    socketServer: Server,
    socketRoomID: string,
    socketTimeDict: Record<string, number>,
  ) {
    socketServer
      .to(`${socketRoomID}`)
      .emit(GameEvents.TimeCalibration, socketTimeDict);
  }

  calibrateTime(socketServer: Server, roomID: string, game: AnyGame) {
    // deducting one secund from currentPlayer
    game.getPlayerOnTurn().timeLeft -= 1000;

    const playerTimes = this.getPlayerTimes(game);

    this.calibrateTimesAcrossClients(socketServer, roomID, playerTimes);

    for (const playerSocketID in playerTimes) {
      if (playerTimes[playerSocketID] <= 0) {
        this.endGame(
          game,
          GameEnding.Timeout,
          game.getNextPlayerOnTurn().socketID,
        );
        socketServer
          .to(`${roomID}`)
          .emit(GameEvents.GameEndedByTimeout, playerSocketID);
      }
    }
  }

  getPlayerTimes(game: AnyGame): Record<string, number> {
    const socketTimeDict = {};
    game.players.forEach((player) => {
      socketTimeDict[player.socketID] = player.timeLeft;
    });
    return socketTimeDict;
  }

  handleJoinGame(socketServer: Server, client: Socket, joinGame: JoinGameDTO) {
    const { roomID, logged, username } = joinGame;
    const game = this.findGame(roomID);

    if (!game) {
      client.emit(GameEvents.InvalidRoomID);
    } else {
      // Adds a players and starts game if the room is full
      this.addPlayer(roomID, client.id, logged, username);

      // FIXME might separate logic from addPlayer into
      // something like addPlayer, checkStartConditions, startGame

      // Subscribing socket to socketIO room
      client.join(roomID);

      if (this.isRunning(roomID)) {
        const gameInfo = this.getGameInfo(roomID);
        socketServer.to(roomID).emit(GameEvents.GameStarted, gameInfo);

        // Delaying the 1s interval for calibration by the time the coin
        // is spinning on client
        setTimeout(() => {
          // set the minute timer
          if (this.findGame(roomID).isRunning) {
            game.calibrationIntervalHandle = setInterval(() => {
              this.calibrateTime(socketServer, roomID, game);
            }, 1000);
          }
        }, 4200);
      }
    }
  }

  handleGameClick(
    socketServer: Server,
    client: Socket,
    gameClickDTO: GameClickDTO,
  ) {
    const { roomID, position } = gameClickDTO;
    const game = this.findGame(roomID);
    if (!game) return;

    if (this.isPlayersTurn(game, client.id)) {
      try {
        this.placeStone(game, position, client.id);

        clearInterval(game.calibrationIntervalHandle);

        const playerOnTurn = game.getPlayerOnTurn();

        const turnData = {
          position,
          times: this.getPlayerTimes(game),
        };

        socketServer.to(roomID).emit(GameEvents.StonePlaced, turnData);

        game.iterateRound();

        const currGameState = this.checkWin(game, position);

        if (currGameState === GameEnding.Combination) {
          const winner = game.getPlayerOnTurn();
          this.endGame(game, currGameState, winner.socketID);
          socketServer
            .to(roomID)
            .emit(GameEvents.GameEndedByCombination, winner.socketID);
        } else if (currGameState === GameEnding.Tie) {
          this.endGame(game, currGameState);
          socketServer.to(roomID).emit(GameEvents.GameEndedByTie);
        } else {
          game.calibrationIntervalHandle = setInterval(() => {
            this.calibrateTime(socketServer, roomID, game);
          }, 1000);
        }
      } catch (error) {
        client.emit(error);
      }
    } else {
      client.emit('notPlayersTurn');
    }
  }

  handleSendMessage(socketServer: Server, client: Socket, message: string) {
    const game = this.findGameBySocketID(client.id);
    client.to(game.roomID).emit(GameEvents.RecieveMessage, message);
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

  isPlayersTurn(game: AnyGame, socketID: string): boolean {
    return game.getPlayerOnTurn().socketID === socketID;
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
    game: AnyGame,
    position: [number, number],
    socketID: string,
  ): void {
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

  saveTimeoutHandle(roomID: string, saveTimeoutHandle: NodeJS.Timeout): void {
    const game = this.findGame(roomID);
    game.timeoutHandleID = saveTimeoutHandle;
  }

  setCalibrationHandle(roomID: string, handle: NodeJS.Timer) {
    const game = this.findGame(roomID);
    game.calibrationIntervalHandle = handle;
  }

  getCalibrationHandle(roomID: string, handle: NodeJS.Timer) {
    const game = this.findGame(roomID);
    return game.calibrationIntervalHandle;
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

  checkWin(game: AnyGame, position: number[]): GameEnding {
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
    game: AnyGame,
    gameEnding: GameEnding,
    winnerSocketID?: string,
  ): void {
    clearInterval(game.calibrationIntervalHandle);
    game.setGameState(GameState.Ended);
    game.setGameEnding(gameEnding);
    if (gameEnding !== GameEnding.Tie) {
      if (winnerSocketID) {
        game.setWinner(winnerSocketID);
      } else {
        throw 'None WinnerSocketID given';
      }
      this.saveGame(game);
    }
  }

  // FIXME only works on two players
  endGameDisconnect(game: AnyGame, disconnecteeID: string) {
    clearInterval(game.calibrationIntervalHandle);
    game.setGameState(GameState.Ended);
    game.setGameEnding(GameEnding.Disconnect);
    game.setWinner(game.getOtherPlayersIDByFirstOnes(disconnecteeID));
    this.saveGame(game);
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
}
