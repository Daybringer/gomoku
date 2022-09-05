import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EndingType,
  Player,
  GameState,
  GameType,
  Position,
} from 'gomoku-shared-types/';
import {
  JoinGameDTO,
  GameClickDTO,
  CreateCustomDTO,
  GameEndedByTimeoutDTO,
  GameStartedEventDTO,
  SocketIOEvents,
  StonePlacedDTO,
  TimeCalibrationDTO,
} from 'src/shared/socketIO';
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

  // HANDLING FUNCTIONS - main functions handling client to server SocketIO events

  async handleJoinGame(server: Server, client: Socket, joinGame: JoinGameDTO) {
    const { roomID, logged, userID } = joinGame;

    const game = this.findGame(roomID);

    if (!game) {
      client.emit(SocketIOEvents.InvalidRoomID);
    } else {
      await this.addPlayer(game, client, logged, userID);
      if (game.isFull && !game.isRunning) game.start();

      // Subscribing socket to SocketIO room
      client.join(roomID);
      if (game.isRunning) {
        const gameStartedDTO = await this.constructGameStartedDTO(game);
        console.log('rip');
        server.to(roomID).emit(SocketIOEvents.GameStarted, gameStartedDTO);

        // Delaying the 1s interval for calibration by the time the coin
        // is spinning on client
        setTimeout(() => {
          // Checking second time if game is still running, because of possible early disconnects
          if (game.isRunning) {
            game.calibrationIntervalHandle = setInterval(() => {
              this.calibrateTime(server, roomID, game);
            }, 1000);
          }
        }, COIN_SPIN_DURATION);
      }
    }
  }

  handleGameClick(server: Server, client: Socket, gameClickDTO: GameClickDTO) {
    const { roomID, position } = gameClickDTO;
    const game = this.findGame(roomID);

    if (!game) throw 'Game not found';
    if (!game.isPlayersTurn(client)) throw "It's not players turn";
    if (!game.isRunning) throw 'Game is not running';
    if (!game.isPositionEmpty(position)) 'Position is not empty';

    this.placeStone(game, position, client);

    clearInterval(game.calibrationIntervalHandle);

    const stonePlacedDTO: StonePlacedDTO = {
      position,
      players: game.players,
    };

    server.to(roomID).emit(SocketIOEvents.StonePlaced, stonePlacedDTO);

    game.iterateRound();

    const currGameState = this.checkWin(game, position);

    if (currGameState === EndingType.Combination) {
      const winner = game.playerOnTurn;
      this.endGame(game, currGameState, winner);
      server.to(roomID).emit(SocketIOEvents.GameEndedByCombination, winner);
    } else if (currGameState === EndingType.Tie) {
      this.endGame(game, currGameState);
      server.to(roomID).emit(SocketIOEvents.GameEndedByTie);
    } else {
      game.calibrationIntervalHandle = setInterval(() => {
        this.calibrateTime(server, roomID, game);
      }, 1000);
    }
  }

  handleSendMessage(server: Server, client: Socket, message: string) {
    const game = this.findGameBySocketID(client.id);
    client.to(game.roomID).emit(SocketIOEvents.RecieveMessage, message);
  }

  // HELPER FUNCTIONS

  /**
   *
   */
  private generateRoomID(...rooms: Record<string, unknown>[]) {
    const IDLength = 6;

    for (let x = 0; x < 100; x++) {
      const randID = Math.random()
        .toString(36)
        .substring(2, IDLength)
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

  // TODO implement no time limit option
  /**
   * function to be called every second; deducts time from current player and emits new times to all connected players
   */
  calibrateTime(server: Server, roomID: string, game: AnyGame) {
    // deducting one second from currentPlayer
    game.playerOnTurn.timeLeft -= 1000;

    // sending new times to clients
    const timeCalibrationDTO: TimeCalibrationDTO = { players: game.players };
    server.to(roomID).emit(SocketIOEvents.TimeCalibration, timeCalibrationDTO);

    // checking if time has run out and possibly ending the game and emitting according event
    game.players.forEach((player) => {
      if (player.timeLeft <= 0) {
        const winner = game.getNextPlayerOnTurn;
        this.endGame(game, EndingType.Time, winner);
        const gameEndedByTimoutDTO: GameEndedByTimeoutDTO = { winner };
        server
          .to(roomID)
          .emit(SocketIOEvents.GameEndedByTimeout, gameEndedByTimoutDTO);
      }
    });
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

  // TODO Optimize foreach to some different struct
  findGame(roomID: string): AnyGame {
    let game = undefined;
    this.gameRooms.forEach((anyGameRooms) => {
      if (anyGameRooms.hasOwnProperty(roomID)) {
        game = anyGameRooms[roomID];
      }
    });
    return game;
  }

  // TODO Optimize foreach to some different struct
  findGameBySocketID(socketID: string): { game: AnyGame; roomID: string } {
    let game: AnyGame = undefined;
    let roomID: string = '';

    this.gameRooms.forEach((anyGameRooms: { [id: string]: AnyGame }) => {
      for (const key in anyGameRooms) {
        anyGameRooms[key].players.forEach((player) => {
          if (player.socket.id === socketID) {
            game = anyGameRooms[key];
            roomID = key;
          }
        });
      }
    });
    return { game, roomID };
  }

  /**
   *
   */
  placeStone(game: AnyGame, position: Position, socket: Socket): void {
    const currPlayerSymbol = game.startingPlayer.socket === socket ? 1 : 2;
    game.setSymbolAt(position, currPlayerSymbol);
    game.saveTurn(position);
  }

  /**
   * Builds DTO containing starting player and players info (if logged)
   */
  async constructGameStartedDTO(game: AnyGame): Promise<GameStartedEventDTO> {
    const gameStartedEventDTO: GameStartedEventDTO = {
      timeLimitInSeconds: game.timeLimitInSeconds,
      startingPlayerSocket: game.startingPlayer.socket,
      players: [],
    };

    game.players.forEach((player) => {
      gameStartedEventDTO.players[player.socket.id] = player;
    });

    return gameStartedEventDTO;
  }

  // TODO implement over 5 character => not a win con OPTION
  checkWin(game: AnyGame, position: number[]): EndingType {
    const round = game.round;
    const gamePlan = game.gameboard;

    const [xPos, yPos] = position;
    const tile = round % 2 ? 1 : 2;
    let horizontal = 0;
    let vertical = 0;
    let diagonalR = 0;
    let diagonalL = 0;
    // FIXME replace constants with gameBoardsize equivalent
    for (let x = -4; x < 5; x++) {
      // * Horizontal check
      if (xPos + x >= 0 && xPos + x <= 14) {
        if (gamePlan[xPos + x][yPos] === tile) {
          horizontal++;
        } else {
          horizontal = 0;
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
      if (
        horizontal >= 5 ||
        vertical >= 5 ||
        diagonalL >= 5 ||
        diagonalR >= 5
      ) {
        return EndingType.Combination;
      }
    }
    if (horizontal >= 5 || vertical >= 5 || diagonalL >= 5 || diagonalR >= 5) {
      return EndingType.Combination;
    } else if (round === game.gameboardSize ** 2 - 1) {
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
    socketIDtoPlayerGameProfileID[playerOne.socket.id] = playerOneProfile.id;
    socketIDtoPlayerGameProfileID[playerTwo.socket.id] = playerTwoProfile.id;

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
        socketIDtoPlayerGameProfileID[game.winner.socket.id];
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
          : profile.id == socketIDtoPlayerGameProfileID[game.winner.socket.id]
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

  async endGame(game: AnyGame, gameEnding: EndingType, winner?: Player) {
    clearInterval(game.calibrationIntervalHandle);
    game.setGameState(GameState.Ended);
    game.setGameEnding(gameEnding);
    if (gameEnding !== EndingType.Tie) {
      if (winner.socket.id) {
        game.winner = winner;
      } else {
        throw 'None WinnerSocketID given';
      }
      return await this.saveGame(game);
    }
  }

  endGameDisconnect(game: AnyGame, disconecteeSocket: Socket) {
    clearInterval(game.calibrationIntervalHandle);
    game.setGameState(GameState.Ended);
    game.setGameEnding(EndingType.Surrender);
    game.winner = game.getOtherPlayer(disconecteeSocket);
    this.saveGame(game);
  }

  /**
   * Creates Player object from given params (with username and icon from database if logged) and adds it to game if it is not full
   */
  async addPlayer(
    game: AnyGame,
    socket: Socket,
    logged: boolean,
    userID: number,
  ): Promise<void> {
    const player: Player = {
      socket,
      userID,
      logged,
      profileIcon: ProfileIcon.defaultBoy,
      username: '',
    };
    if (logged) {
      const user = await this.usersService.findOneByID(userID);
      player.profileIcon = user.selectedIcon;
      player.username = user.username;
    }
    if (!game.isFull) game.addPlayer(player);
  }
}
