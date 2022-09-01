import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  JoinGameDTO,
  GameEvents,
  GameClickDTO,
  EndingType,
  Player,
  GameState,
  GameType,
} from 'gomoku-shared-types/';
import { CreateCustomDTO, GameStartedEventDTO } from 'src/shared/socketIO';
import { Server, Socket } from 'socket.io';
import { GameEntity } from 'src/models/game.entity';
import { PlayerGameProfile } from 'src/models/playerGameProfile.entity';
import { COIN_SPIN_DURATION } from 'src/shared/constants';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AnyGame, CustomGame, QuickGame, RankedGame } from '../game.class';
import { ProfileIcon } from 'src/shared/icons';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(PlayerGameProfile)
    private readonly playerGameProfileRepository: Repository<PlayerGameProfile>,
    private readonly usersService: UsersService,
  ) {}
  quickGameRooms: { [id: string]: QuickGame } = {};
  rankedGameRooms: { [id: string]: RankedGame } = {};
  customGameRooms: { [id: string]: CustomGame } = {};

  gameRooms = [this.quickGameRooms, this.rankedGameRooms, this.customGameRooms];

  createCustomGame(createCustomDTO: CreateCustomDTO): {
    game: CustomGame;
    roomID: string;
  } {
    const { hasTimeLimit, opening, timeLimitInSeconds } = createCustomDTO;
    const roomID = this.generateRoomID(...this.gameRooms);
    const customGame = new CustomGame(
      hasTimeLimit,
      timeLimitInSeconds,
      opening,
    );
    this.customGameRooms[roomID] = customGame;
    return { game: customGame, roomID };
  }

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
          EndingType.Surrender,
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

  async handleJoinGame(
    socketServer: Server,
    client: Socket,
    joinGame: JoinGameDTO,
  ) {
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
        const gameStartedDTO = await this.constructGameStartedDTO(roomID);
        socketServer.to(roomID).emit(GameEvents.GameStarted, gameStartedDTO);

        // Delaying the 1s interval for calibration by the time the coin
        // is spinning on client
        setTimeout(() => {
          // set the minute timer
          if (this.findGame(roomID).isRunning) {
            game.calibrationIntervalHandle = setInterval(() => {
              this.calibrateTime(socketServer, roomID, game);
            }, 1000);
          }
        }, COIN_SPIN_DURATION);
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

        if (currGameState === EndingType.Combination) {
          const winner = game.getPlayerOnTurn();
          this.endGame(game, currGameState, winner.socketID);
          socketServer
            .to(roomID)
            .emit(GameEvents.GameEndedByCombination, winner.socketID);
        } else if (currGameState === EndingType.Tie) {
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

  // FIXME optimize so it returns straightaway if it finds the room with given ID
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
      return game.getNextPlayerOnTurn().secondsLeft;
    }
  }

  // Util functions; might move gateway logic here

  iterateRound(roomID: string): void {
    this.findGame(roomID).iterateRound();
  }

  async constructGameStartedDTO(roomID: string): Promise<GameStartedEventDTO> {
    const { players, startingPlayer, timeLimitInSeconds } =
      this.findGame(roomID);
    const gameStartedEventDTO: GameStartedEventDTO = {
      timeLimitInSeconds,
      startingPlayerSocketID: startingPlayer.socketID,
      players: {},
    };

    console.log('PLAYERS', players);

    // FIXME remove this demon code -> rewrite whole logic
    const player = players[0];
    const playerWithConfig = {
      logged: player.logged,
      secondsLeft: player.secondsLeft,
      username: player.username,
      userID: 0,
      profileIcon: ProfileIcon.defaultBoy,
    };
    if (player.logged) {
      const user = await this.usersService.findOneByUsername(player.username);
      playerWithConfig.profileIcon = user.selectedIcon;
      playerWithConfig.userID = user.id;
    }

    gameStartedEventDTO.players[player.socketID] = playerWithConfig;

    const player1 = players[1];
    const playerWithConfig1 = {
      logged: player1.logged,
      secondsLeft: player1.secondsLeft,
      username: player1.username,
      userID: 0,
      profileIcon: ProfileIcon.defaultBoy,
    };
    if (player1.logged) {
      const user = await this.usersService.findOneByUsername(player1.username);
      playerWithConfig1.profileIcon = user.selectedIcon;
      playerWithConfig1.userID = user.id;
    }

    gameStartedEventDTO.players[player1.socketID] = playerWithConfig1;

    return gameStartedEventDTO;
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

  checkWin(game: AnyGame, position: number[]): EndingType {
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
        return EndingType.Combination;
      }
    }
    if (horizont >= 5 || vertical >= 5 || diagonalL >= 5 || diagonalR >= 5) {
      return EndingType.Combination;
    } else if (round === 225) {
      return EndingType.Tie;
    } else {
      return;
    }
  }

  async savePlayerGameProfile(player: Player): Promise<PlayerGameProfile> {
    const playerGameProfileEntity = this.playerGameProfileRepository.create();

    if (player.logged) {
      const user = await this.usersService.findOneByUsername(player.username);
      playerGameProfileEntity.userID = user.id;
    }

    playerGameProfileEntity.timeLeft = player.timeLeft;

    return await this.playerGameProfileRepository.save(playerGameProfileEntity);
  }

  async saveGame(game: AnyGame) {
    const gameEntity: GameEntity = this.gameRepository.create();
    // Profiles
    const socketIDtoPlayerGameProfileID: { [socketID: string]: number } = {};

    const [playerOne, playerTwo] = game.players;

    const playerOneProfile = await this.savePlayerGameProfile(playerOne);
    const playerTwoProfile = await this.savePlayerGameProfile(playerTwo);
    socketIDtoPlayerGameProfileID[playerOne.socketID] = playerOneProfile.id;
    socketIDtoPlayerGameProfileID[playerTwo.socketID] = playerTwoProfile.id;

    // TODO
    // ranked game -> calculate Elo delta save it to profiles and update elos of users
    if (game.gameType === GameType.Ranked) {
      // get Elos
    }

    gameEntity.type = game.gameType;
    gameEntity.finalState = game.gameboard;
    gameEntity.turnHistory = game.turns;
    gameEntity.typeOfWin = game.gameEnding;
    // there has to be a winner
    if (game.gameEnding !== EndingType.Tie) {
      gameEntity.winnerGameProfileID =
        socketIDtoPlayerGameProfileID[game.winner.socketID];
    }

    gameEntity.playerGameProfileIDs = [
      playerOneProfile.id,
      playerTwoProfile.id,
    ];

    [playerOneProfile, playerTwoProfile].forEach(async (profile) => {
      // if a player is logged in, update their game stats and update achievements
      if (profile.userID) {
        const user = await this.usersService.findOneByID(profile.userID);

        this.usersService.checkAchievements(user, game);

        const isTie = game.gameEnding === EndingType.Tie;
        const isThisUserTheWinner = isTie
          ? false
          : profile.id == socketIDtoPlayerGameProfileID[game.winner.socketID]
          ? true
          : false;

        this.usersService.addNewGameToStats(
          user,
          game.gameType,
          isThisUserTheWinner,
          isTie,
        );
      }
    });

    return this.gameRepository.save(gameEntity);
  }

  async endGame(
    game: AnyGame,
    gameEnding: EndingType,
    winnerSocketID?: string,
  ) {
    clearInterval(game.calibrationIntervalHandle);
    game.setGameState(GameState.Ended);
    game.setGameEnding(gameEnding);
    if (gameEnding !== EndingType.Tie) {
      if (winnerSocketID) {
        game.setWinner(winnerSocketID);
      } else {
        throw 'None WinnerSocketID given';
      }
      return await this.saveGame(game);
    }
  }

  // FIXME only works on two players
  endGameDisconnect(game: AnyGame, disconnecteeID: string) {
    clearInterval(game.calibrationIntervalHandle);
    game.setGameState(GameState.Ended);
    game.setGameEnding(EndingType.Surrender);
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
    }
  }
}
