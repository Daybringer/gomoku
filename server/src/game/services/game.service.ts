import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EndingType,
  Player,
  GameState,
  GameType,
  Position,
  Symbol,
  OpeningPhase,
} from 'gomoku-shared-types/';
import {
  JoinGameDTO,
  GameClickDTO,
  CreateCustomDTO,
  GameStartedEventDTO,
  SocketIOEvents,
  StonePlacedDTO,
  TimeCalibrationDTO,
  ToClientSwapPickGameStoneDTO,
  ToServerSwapPickGameStoneDTO,
  SwapGameStonePickedDTO,
  GameEndedDTO,
} from 'src/shared/socketIO';
import { Server, Socket } from 'socket.io';
import { GameEntity } from 'src/models/game.entity';
import { PlayerGameProfile } from 'src/models/playerGameProfile.entity';
import { COIN_SPIN_DURATION } from 'src/shared/constants';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AnyGame, CustomGame, QuickGame, RankedGame } from '../game.class';
import { ProfileIcon } from 'src/shared/icons';
import { createRatingSystem } from './rating';

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
      await this.addPlayer(game, client.id, logged, userID);
      if (game.isFull && !game.isRunning) game.start();

      // Subscribing socket to SocketIO room
      client.join(roomID);
      if (game.isRunning) {
        const gameStartedDTO = await this.constructGameStartedDTO(game);
        server.to(roomID).emit(SocketIOEvents.GameStarted, gameStartedDTO);

        // Delaying the 1s interval for calibration by the time the coin
        // is spinning on client
        if (game.hasTimeLimit) {
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
  }

  async handleGameClick(
    server: Server,
    client: Socket,
    gameClickDTO: GameClickDTO,
  ) {
    const { roomID, position } = gameClickDTO;
    const game = this.findGame(roomID);

    if (!game) throw 'Game not found';
    if (!(game.currentPlayer.socketID === client.id))
      throw "It's not players turn";
    if (!game.isRunning) throw 'Game is not running';
    if (!game.isPositionEmpty(position)) throw 'Position is not empty';

    if (game.openingPhase === OpeningPhase.Place3 && game.round < 3) {
      // SWAP1 first phase - player is placing three game stones
      const currSymbol = game.round % 2 === 0 ? 1 : 2;
      game.placeStone(position, currSymbol);
      game.iterateRound();

      const stonePlacedDTO: StonePlacedDTO = {
        position,
        players: game.players,
        currentPlayer: game.currentPlayer,
      };
      server.to(roomID).emit(SocketIOEvents.StonePlaced, stonePlacedDTO);

      // SWAP1 - Last game stone has been placed:
      if (game.round === 3) {
        game.openingPhase = OpeningPhase.PickGameStone;
        game.currentPlayer = game.getNextPlayer;
        const toClientSwapPickGameStoneDTO: ToClientSwapPickGameStoneDTO = {
          pickingPlayer: game.currentPlayer,
        };
        server
          .to(roomID)
          .emit(
            SocketIOEvents.ToClientSwapPickGameStone,
            toClientSwapPickGameStoneDTO,
          );
      }
    } else if (game.openingPhase === OpeningPhase.PickGameStone) {
      // SWAP1 second phase - players is choosing their symbol => do nothing
    } else if (game.openingPhase === OpeningPhase.Done) {
      game.placeStone(position, game.currentPlayer.playerSymbol);
      const stonePlacedDTO: StonePlacedDTO = {
        position,
        players: game.players,
        currentPlayer: game.getNextPlayer,
      };
      server.to(roomID).emit(SocketIOEvents.StonePlaced, stonePlacedDTO);

      clearInterval(game.calibrationIntervalHandle);

      // FIXME change structure of checkWin to return {hasEnded:,endingType:}
      const currGameState = this.checkWin(game, position, 15, 5, false);

      if (currGameState === null) {
        game.iterateRound();
        game.currentPlayer = game.getNextPlayer;

        if (game.hasTimeLimit) {
          game.calibrationIntervalHandle = setInterval(() => {
            this.calibrateTime(server, roomID, game);
          }, 1000);
        }
      } else {
        const winner = game.currentPlayer;

        let elos = {};
        if (game.gameType === GameType.Ranked) {
          elos = await this.calcElo(
            game.players[0].userID,
            game.players[1].userID,
            currGameState === EndingType.Tie,
            winner.userID,
          );
        }

        const dto: GameEndedDTO = {
          endingType: currGameState,
          winner,
          userIDToEloDiff: elos,
        };

        this.endGame(game, currGameState, winner);

        server.to(roomID).emit(SocketIOEvents.GameEnded, dto);
      }

      // if (currGameState === EndingType.Combination) {
      //   const winner = game.currentPlayer;
      //   const elos = await this.calcElo(
      //     game.players[0].userID,
      //     game.players[1].userID,
      //     false,
      //     winner.userID,
      //   );
      //   this.endGame(game, currGameState, winner);
      //   const dto: GameEndedDTO = {
      //     endingType: EndingType.Combination,
      //     winner,
      //     userIDToEloDiff: elos,
      //   };
      //   server.to(roomID).emit(SocketIOEvents.GameEnded, dto);
      // } else if (currGameState === EndingType.Tie) {
      //   this.endGame(game, currGameState);
      //   const elos = await this.calcElo(
      //     game.players[0].userID,
      //     game.players[1].userID,
      //     true,
      //   );
      //   const dto: GameEndedDTO = {
      //     endingType: EndingType.Tie,
      //     userIDToEloDiff: elos,
      //   };
      //   server.to(roomID).emit(SocketIOEvents.GameEnded, dto);
      // } else {
      // }
    }
  }

  async handlePickGameStone(
    server: Server,
    client: Socket,
    dto: ToServerSwapPickGameStoneDTO,
  ): Promise<void> {
    const game = this.findGame(dto.roomID);
    if (!game) throw 'Game not found';
    if (client.id === game.currentPlayer.socketID) {
      game.currentPlayer.playerSymbol = dto.pickedSymbol;
      const otherSymbol = 3 - dto.pickedSymbol;
      game.getNextPlayer.playerSymbol = otherSymbol as Symbol;

      // cross has less symbols so player with cross is now currentPlayer
      if (dto.pickedSymbol === 1) {
        game.currentPlayer = game.getNextPlayer;
      }

      game.openingPhase = OpeningPhase.Done;

      const swapGameStonePickedDTO: SwapGameStonePickedDTO = {
        players: game.players,
        currentPlayer: game.currentPlayer,
      };
      server
        .to(dto.roomID)
        .emit(SocketIOEvents.SwapGameStonePicked, swapGameStonePickedDTO);
    }
  }

  handleSendMessage(server: Server, client: Socket, message: string) {
    const game = this.findGameBySocketID(client.id);
    client.to(game.roomID).emit(SocketIOEvents.RecieveMessage, message);
  }

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

  /**
   * function to be called every second; deducts time from current player and emits new times to all connected players
   */
  async calibrateTime(server: Server, roomID: string, game: AnyGame) {
    // deducting one second from currentPlayer
    game.currentPlayer.timeLeft -= 1000;

    // sending new times to clients
    const timeCalibrationDTO: TimeCalibrationDTO = { players: game.players };
    server.to(roomID).emit(SocketIOEvents.TimeCalibration, timeCalibrationDTO);

    // checking if time has run out and possibly ending the game and emitting according event

    if (game.currentPlayer.timeLeft <= 0) {
      const winner = game.getNextPlayer;
      let elos = {};

      if (game.gameType === GameType.Ranked) {
        elos = await this.calcElo(
          game.players[0].userID,
          game.players[1].userID,
          false,
          winner.userID,
        );
      }

      this.endGame(game, EndingType.Time, winner);
      const dto: GameEndedDTO = {
        endingType: EndingType.Time,
        winner,
        userIDToEloDiff: elos,
      };
      server.to(roomID).emit(SocketIOEvents.GameEnded, dto);
    }
  }

  generateQuickGameRoom(): { game: QuickGame; roomID: string } {
    const roomID = this.generateRoomID(...this.gameRooms);
    const newQuickGameRoom = new QuickGame();
    this.quickGameRooms[roomID] = newQuickGameRoom;
    return { game: newQuickGameRoom, roomID };
  }

  generateRankedGameRoom(playerUserIDs: [number, number]): {
    game: RankedGame;
    roomID: string;
  } {
    const roomID = this.generateRoomID(...this.gameRooms);
    const newRankedGameRoom = new RankedGame(playerUserIDs);
    this.rankedGameRooms[roomID] = newRankedGameRoom;
    return { game: newRankedGameRoom, roomID };
  }

  /**
   * @returns -{userID:eloDiff} object
   */
  async calcElo(
    playerAUserID: number,
    playerBUserID: number,
    isTie: boolean,
    winnerUserID?: number,
  ): Promise<Record<number, number>> {
    const playerAElo = (await this.usersService.findOneByID(playerAUserID)).elo;
    const playerBElo = (await this.usersService.findOneByID(playerBUserID)).elo;

    const ratingSystem = createRatingSystem(20, 600);
    const APlayerScore = isTie ? 0.5 : winnerUserID == playerAUserID ? 2 : 0;
    const { playerARatingDiff, playerBRatingDiff } =
      ratingSystem.getNextRatings(playerAElo, playerBElo, APlayerScore);

    const result = {};
    result[playerAUserID] = playerARatingDiff;
    result[playerBUserID] = playerBRatingDiff;
    console.log(result, result[playerAUserID]);

    return result;
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
          if (player.socketID === socketID) {
            game = anyGameRooms[key];
            roomID = key;
          }
        });
      }
    });
    return { game, roomID };
  }

  /**
   * Builds DTO containing starting player and players info (if logged)
   */
  async constructGameStartedDTO(game: AnyGame): Promise<GameStartedEventDTO> {
    const gameStartedEventDTO: GameStartedEventDTO = {
      timeLimitInSeconds: game.timeLimitInSeconds,
      startingPlayer: game.startingPlayer,
      opening: game.opening,
      hasTimeLimit: game.hasTimeLimit,
      players: [],
    };

    game.players.forEach((player) => {
      gameStartedEventDTO.players.push(player);
    });

    return gameStartedEventDTO;
  }

  // TODO return winning combination
  checkWin(
    game: AnyGame,
    position: [number, number],
    gameboardSize: number = 15,
    winChainLength: number = 5,
    exactChainLength: boolean = false,
  ): EndingType | null {
    const gamePlan = game.gameboard;

    const [xPos, yPos] = position;
    const symbol = game.currentPlayer.playerSymbol;
    let horizontal = 0;
    let vertical = 0;
    let diagonalR = 0;
    let diagonalL = 0;
    for (let x = -(winChainLength - 1); x < winChainLength; x++) {
      // HORIZONTAL check
      if (xPos + x >= 0 && xPos + x <= gameboardSize - 1) {
        if (gamePlan[xPos + x][yPos] === symbol) {
          horizontal++;
        } else {
          horizontal = 0;
        }
      }

      // VERTICAL check
      if (yPos + x >= 0 && yPos + x <= gameboardSize - 1) {
        if (gamePlan[xPos][yPos + x] === symbol) {
          vertical++;
        } else {
          vertical = 0;
        }
      }

      // DIAGONAL checks
      if (
        yPos + x >= 0 &&
        yPos + x <= gameboardSize - 1 &&
        xPos + x >= 0 &&
        xPos + x <= gameboardSize - 1
      ) {
        if (gamePlan[xPos + x][yPos + x] === symbol) {
          diagonalR++;
        } else {
          diagonalR = 0;
        }
      }

      if (
        yPos + x >= 0 &&
        yPos + x <= gameboardSize - 1 &&
        xPos - x >= 0 &&
        xPos - x <= gameboardSize - 1
      ) {
        if (gamePlan[xPos - x][yPos + x] === symbol) {
          diagonalL++;
        } else {
          diagonalL = 0;
        }
      }

      if (exactChainLength) {
        if (
          horizontal == winChainLength ||
          vertical == winChainLength ||
          diagonalL == winChainLength ||
          diagonalR == winChainLength
        ) {
          return EndingType.Combination;
        }
      } else {
        if (
          horizontal >= winChainLength ||
          vertical >= winChainLength ||
          diagonalL >= winChainLength ||
          diagonalR >= winChainLength
        ) {
          return EndingType.Combination;
        }
      }
    }
    if (game.round === game.gameboardSize ** 2 - 1) {
      return EndingType.Tie;
    }

    return null;
  }

  async savePlayerGameProfile(
    player: Player,
    eloDiff?: number,
  ): Promise<PlayerGameProfile> {
    const playerGameProfileEntity = this.playerGameProfileRepository.create();

    if (player.logged) {
      const user = await this.usersService.findOneByUsername(player.username);
      playerGameProfileEntity.userID = user.id;
    }

    if (eloDiff) {
      playerGameProfileEntity.eloDelta = eloDiff;
    }

    playerGameProfileEntity.timeLeft = player.timeLeft;

    return await this.playerGameProfileRepository.save(playerGameProfileEntity);
  }

  async saveGame(game: AnyGame) {
    const gameEntity: GameEntity = this.gameRepository.create();
    // Profiles
    const socketIDtoPlayerGameProfileID: { [socketID: string]: number } = {};

    const [playerOne, playerTwo] = game.players;
    let playerOneProfile, playerTwoProfile;
    if (game.gameType === GameType.Ranked) {
      const elos = await this.calcElo(
        playerOne.userID,
        playerTwo.userID,
        game.gameEnding === EndingType.Tie,
        game.winner ? game.winner.userID : 0,
      );
      playerOneProfile = await this.savePlayerGameProfile(
        playerOne,
        elos[playerOne.userID],
      );
      await this.usersService.updateElo(
        playerOne.userID,
        elos[playerOne.userID],
      );

      playerTwoProfile = await this.savePlayerGameProfile(
        playerTwo,
        elos[playerTwo.userID],
      );
      await this.usersService.updateElo(
        playerTwo.userID,
        elos[playerTwo.userID],
      );
    } else {
      playerOneProfile = await this.savePlayerGameProfile(playerOne);
      playerTwoProfile = await this.savePlayerGameProfile(playerTwo);
    }

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

  async endGame(game: AnyGame, gameEnding: EndingType, winner?: Player) {
    clearInterval(game.calibrationIntervalHandle);
    game.setGameState(GameState.Ended);
    game.setGameEnding(gameEnding);
    if (gameEnding !== EndingType.Tie) {
      game.winner = winner;
    }
    return await this.saveGame(game);
  }

  endGameDisconnect(game: AnyGame, disconecteeSocket: Socket) {
    clearInterval(game.calibrationIntervalHandle);
    game.setGameState(GameState.Ended);
    game.setGameEnding(EndingType.Surrender);
    game.winner = game.getOtherPlayer(disconecteeSocket.id);

    this.saveGame(game);
  }

  /**
   * Creates Player object from given params (with username and icon from database if logged) and adds it to game if it's not full
   */
  async addPlayer(
    game: AnyGame,
    socketID: string,
    logged: boolean,
    userID: number,
  ): Promise<void> {
    const player: Player = {
      socketID,
      userID,
      logged,
      profileIcon: ProfileIcon.defaultBoy,
      username: '',
      timeLeft: game.timeLimitInSeconds * 1000,
      playerSymbol: 0,
    };
    if (logged) {
      const user = await this.usersService.findOneByID(userID);
      player.profileIcon = user.selectedIcon;
      player.username = user.username;
    } else {
      player.username = this.usersService.generateRandomName();
    }
    if (!game.isFull) game.addPlayer(player);
  }
}
