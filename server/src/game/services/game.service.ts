import { GetGameByUserIDDTOResponse } from 'src/shared/DTO/get-game-by-user-id.response.dto';
import { GetGamesByUserIDDTO } from 'src/shared/DTO/get-game-by-user-id.dto';
import { GetGameByIDResponseDTO } from 'src/shared/DTO/get-game-by-id.response.dto';
import { ExpandedGame } from 'src/shared/interfaces/game.interface';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EndingType,
  Player,
  GameState,
  GameType,
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
import { In, Repository } from 'typeorm';
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
  customRematch: { [roomID: string]: number } = {};

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
      if (game.isFull || game.isRunning) {
        client.emit(SocketIOEvents.InvalidRoomID);
        throw 'Game is already full/running';
      }

      // Subscribing socket to SocketIO room
      client.join(roomID);

      await this.addPlayer(game, client.id, logged, userID);
      if (game.isFull && !game.isRunning) game.start();

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

  /**
   *
   * @param server
   * @param client
   * @param gameClickDTO
   */
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

      const [column, row] = position;

      if (game.gameboard.hasWon(game.currentPlayer.playerSymbol, column, row)) {
        const winner = game.currentPlayer;

        let elos = {};

        if (game.gameType === GameType.Ranked) {
          elos = await this.calcElo(
            game.players[0].userID,
            game.players[1].userID,
            false,
            winner.userID,
          );
        }

        const dto: GameEndedDTO = {
          endingType: EndingType.Combination,
          winningCombination: game.gameboard.getWinningCombination(),
          winner,
          userIDToEloDiff: elos,
        };

        this.endGame(game, EndingType.Combination, winner);

        server.to(roomID).emit(SocketIOEvents.GameEnded, dto);
      } else {
        game.iterateRound();
        game.currentPlayer = game.getNextPlayer;

        let elos = {};

        if (game.gameType === GameType.Ranked) {
          elos = await this.calcElo(
            game.players[0].userID,
            game.players[1].userID,
            false,
          );
        }

        if (game.gameboard.isTie()) {
          const dto: GameEndedDTO = {
            endingType: EndingType.Tie,
            userIDToEloDiff: elos,
          };
          return;
        }

        if (game.hasTimeLimit) {
          game.calibrationIntervalHandle = setInterval(() => {
            this.calibrateTime(server, roomID, game);
          }, 1000);
        }

        // TODO check tie
        // FIXME !!!!
        //game.gameboard.isTie();
      }
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

  handleCustomAskForRematch(
    server: Server,
    client: Socket,
    oldRoomID: string,
    settings: CreateCustomDTO,
  ) {
    if (oldRoomID in this.customRematch) {
      this.customRematch[oldRoomID]++;
    } else {
      this.customRematch[oldRoomID] = 1;
    }
    if (this.customRematch[oldRoomID] === 2) {
      const { roomID } = this.createCustomGame(settings);
      server.to(oldRoomID).emit(SocketIOEvents.RedirectToCustomRematch, roomID);
      delete this.customRematch[oldRoomID];
    }
  }

  // HELPER FUNCTIONS

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

  async savePlayerGameProfile(
    gameID: number,
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
    playerGameProfileEntity.gameID = gameID;

    return await this.playerGameProfileRepository.save(playerGameProfileEntity);
  }

  async saveGame(game: AnyGame) {
    const gameEntity: GameEntity = this.gameRepository.create();
    // Profiles
    const socketIDtoPlayerGameProfileID: { [socketID: string]: number } = {};

    const [playerOne, playerTwo] = game.players;
    let playerOneProfile: PlayerGameProfile,
      playerTwoProfile: PlayerGameProfile;
    if (game.gameType === GameType.Ranked) {
      const elos = await this.calcElo(
        playerOne.userID,
        playerTwo.userID,
        game.gameEnding === EndingType.Tie,
        game.winner ? game.winner.userID : 0,
      );
      playerOneProfile = await this.savePlayerGameProfile(
        0,
        playerOne,
        elos[playerOne.userID],
      );
      await this.usersService.updateElo(
        playerOne.userID,
        elos[playerOne.userID],
      );

      playerTwoProfile = await this.savePlayerGameProfile(
        0,
        playerTwo,
        elos[playerTwo.userID],
      );
      await this.usersService.updateElo(
        playerTwo.userID,
        elos[playerTwo.userID],
      );
    } else {
      playerOneProfile = await this.savePlayerGameProfile(
        gameEntity.id,
        playerOne,
      );
      playerTwoProfile = await this.savePlayerGameProfile(
        gameEntity.id,
        playerTwo,
      );
    }

    socketIDtoPlayerGameProfileID[playerOne.socketID] = playerOneProfile.id;
    socketIDtoPlayerGameProfileID[playerTwo.socketID] = playerTwoProfile.id;

    gameEntity.type = game.gameType;
    gameEntity.finalState = game.gameboard.getBoard();
    gameEntity.turnHistory = game.turns;
    gameEntity.typeOfWin = game.gameEnding;
    gameEntity.timeLimitInSeconds = game.timeLimitInSeconds;
    if (
      game.gameEnding === EndingType.Combination ||
      game.gameEnding === EndingType.Tie
    ) {
      gameEntity.winningCombination = game.gameboard.getWinningCombination();
    }
    // FIXME load normal values
    gameEntity.openingType = game.opening;
    gameEntity.hasTimeLimit = game.hasTimeLimit;
    gameEntity.doesOverlineCount = true;
    gameEntity.boardSize = 15;
    gameEntity.winningLineSize = 5;

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

    const savedGameEntity = await this.gameRepository.save(gameEntity);

    this.playerGameProfileRepository.update(playerOneProfile.id, {
      gameID: savedGameEntity.id,
    });
    this.playerGameProfileRepository.update(playerTwoProfile.id, {
      gameID: savedGameEntity.id,
    });
    return savedGameEntity;
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

  async expandGame(
    game: GameEntity,
    playerGameProfiles: PlayerGameProfile[],
  ): Promise<ExpandedGame> {
    const expandedGame: ExpandedGame = {
      ...game,
      expandedPlayerGameProfiles: {},
    };

    for await (const profile of playerGameProfiles) {
      expandedGame.expandedPlayerGameProfiles[profile.id] = { ...profile };
      // If User was logged
      if (profile.userID) {
        const user = await this.usersService.findOneByID(profile.userID);
        expandedGame.expandedPlayerGameProfiles[profile.id] = {
          ...profile,
          username: user.username,
          profileIcon: user.selectedIcon,
        };
      }
    }

    return expandedGame;
  }

  async getGameByID(gameID: number): Promise<GetGameByIDResponseDTO> {
    const game = await this.gameRepository.findOne({ where: { id: gameID } });
    if (!game) throw new BadRequestException("Game doesn't exist");
    const playerGameProfiles = await this.playerGameProfileRepository.findByIds(
      game.playerGameProfileIDs,
    );
    if (playerGameProfiles.length !== 2)
      throw new BadRequestException(
        'Game profiles are corrupted (missing/overflowing)',
      );

    return { game: await this.expandGame(game, playerGameProfiles) };
  }

  async getGamesByUserID(
    dto: GetGamesByUserIDDTO,
  ): Promise<GetGameByUserIDDTOResponse> {
    const constraints = dto.constraints;

    // TODO fix this with relations
    const gameProfiles = await this.playerGameProfileRepository.find({
      where: { userID: dto.userID },
      order: { id: 'DESC' },
      skip: dto.skip,
      take: dto.take,
    });

    const gameIDs = gameProfiles.map((gameProfile) => gameProfile.gameID);

    const expandedGames: ExpandedGame[] = [];

    for await (const gameID of gameIDs) {
      expandedGames.push((await this.getGameByID(gameID)).game);
    }

    return { games: expandedGames };
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
