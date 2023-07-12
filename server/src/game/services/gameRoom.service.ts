import {
  EndingType,
  GameState,
  GameType,
  OpeningPhase,
  Player,
  Symbol,
} from 'src/shared/types';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AnyGame, CustomGame, QuickGame, RankedGame } from '../game.class';
import {
  CreateCustomDTO,
  GameClickDTO,
  GameEndedDTO,
  GameStartedEventDTO,
  JoinGameDTO,
  SocketIOEvents,
  StonePlacedDTO,
  SwapGameStonePickedDTO,
  TimeCalibrationDTO,
  ToClientSwapPickGameStoneDTO,
  ToServerSwapPickGameStoneDTO,
} from 'src/shared/socketIO';
import { Server, Socket } from 'socket.io';
import { ProfileIcon } from 'src/shared/icons';
import { UsersService } from 'src/users/users.service';
import { COIN_SPIN_DURATION } from 'src/shared/constants';
import { GameService } from './game.service';

@Injectable()
export class GameRoomService {
  constructor(
    private readonly usersService: UsersService,
    private readonly gameService: GameService,
  ) {}
  private readonly logger = new Logger(GameRoomService.name);
  gameRooms: { [id: string]: AnyGame } = {};

  // ------------------- HANDLING FUNCTIONS -------------------

  async handleJoinGameRoom(
    server: Server,
    client: Socket,
    joinGame: JoinGameDTO,
  ) {
    const { roomID, userID } = joinGame;

    const room = this.findGameRoom(roomID);

    if (!room) {
      client.emit(SocketIOEvents.InvalidRoomID);
      this.logger.debug("Room doesn't exist");
      return;
    }

    if (room.isFull || room.isRunning) {
      client.emit(SocketIOEvents.InvalidRoomID);
      return;
    }

    // Subscribing socket to SocketIO room
    client.join(roomID);

    const player = await this.constructPlayer(
      client.id,
      room.timeLimitInSeconds,
      userID,
    );
    if (!player) {
      client.emit(SocketIOEvents.InvalidRoomID);
      this.logger.error("Player couldn't be constructed");
    }
    try {
      room.addPlayer(player);
    } catch (err) {
      client.emit(SocketIOEvents.InvalidRoomID);
      return;
    }

    if (room.isFull && !room.isRunning) room.start();

    if (room.isRunning) {
      this.logger.debug('Starting game');
      const gameStartedDTO = await this.constructGameStartedDTO(room);
      server.to(roomID).emit(SocketIOEvents.GameStarted, gameStartedDTO);

      // Delaying the 1s interval for calibration by the time the coin
      // is spinning on client
      if (room.hasTimeLimit) {
        setTimeout(() => {
          // Checking second time if game is still running, because of possible early disconnects
          if (room.isRunning) {
            room.calibrationIntervalHandle = setInterval(() => {
              this.calibrateTime(server, roomID, room);
            }, 1000);
          }
        }, COIN_SPIN_DURATION);
      }
    }
  }

  /**
   * Creates an according Game, pairs it with roomID and returns it with generated room ID
   *
   * Has side effect of reserving given **roomID** in gameRooms prop object
   */
  createGameRoom(
    type: GameType,
    customSettings?: CreateCustomDTO,
  ): { game: AnyGame; roomID: string } {
    const roomID = this.generateRoomID();
    let game: AnyGame;
    switch (type) {
      case GameType.Quick:
        game = new QuickGame();
        break;
      case GameType.Ranked:
        game = new RankedGame();
        break;
      case GameType.Custom:
        game = new CustomGame(
          customSettings.hasTimeLimit,
          customSettings.timeLimitInSeconds,
          customSettings.opening,
        );
        break;
    }
    this.gameRooms[roomID] = game;
    return { game, roomID };
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
    const room = this.findGameRoom(roomID);

    if (!room) throw 'Game not found';
    if (!(room.currentPlayer.socketID === client.id))
      throw "It's not players turn";
    if (!room.isRunning) throw 'Game is not running';
    if (!room.isPositionEmpty(position)) throw 'Position is not empty';

    if (room.openingPhase === OpeningPhase.Place3 && room.round < 3) {
      // SWAP1 first phase - player is placing three game stones
      const currSymbol = room.round % 2 === 0 ? 1 : 2;
      room.placeStone(position, currSymbol);
      room.iterateRound();

      const stonePlacedDTO: StonePlacedDTO = {
        position,
        players: room.players,
        currentPlayer: room.currentPlayer,
      };
      server.to(roomID).emit(SocketIOEvents.StonePlaced, stonePlacedDTO);

      // SWAP1 - Last game stone has been placed:
      if (room.round === 3) {
        room.openingPhase = OpeningPhase.PickGameStone;
        room.currentPlayer = room.getNextPlayer;
        const toClientSwapPickGameStoneDTO: ToClientSwapPickGameStoneDTO = {
          pickingPlayer: room.currentPlayer,
        };
        server
          .to(roomID)
          .emit(
            SocketIOEvents.ToClientSwapPickGameStone,
            toClientSwapPickGameStoneDTO,
          );
      }
    } else if (room.openingPhase === OpeningPhase.PickGameStone) {
      // SWAP1 second phase - players is choosing their symbol => do nothing
    } else if (room.openingPhase === OpeningPhase.Done) {
      room.placeStone(position, room.currentPlayer.playerSymbol);
      const stonePlacedDTO: StonePlacedDTO = {
        position,
        players: room.players,
        currentPlayer: room.getNextPlayer,
      };
      server.to(roomID).emit(SocketIOEvents.StonePlaced, stonePlacedDTO);

      clearInterval(room.calibrationIntervalHandle);

      const [column, row] = position;

      if (room.gameboard.hasWon(room.currentPlayer.playerSymbol, column, row)) {
        const winner = room.currentPlayer;
        this.endGame(server, room, roomID, EndingType.Combination, winner);
      } else {
        room.iterateRound();
        room.currentPlayer = room.getNextPlayer;
        if (room.hasTimeLimit) {
          room.calibrationIntervalHandle = setInterval(() => {
            this.calibrateTime(server, roomID, room);
          }, 1000);
        }
      }
    }
  }

  handleSendMessage(server: Server, client: Socket, message: string) {
    const roomID = this.findRoomIDBySocketID(client.id);
    if (this.findGameRoom(roomID) === null) throw "Room doesn't exist";
    client.to(roomID).emit(SocketIOEvents.RecieveMessage, message);
  }

  async handlePickGameStone(
    server: Server,
    client: Socket,
    dto: ToServerSwapPickGameStoneDTO,
  ): Promise<void> {
    const room = this.findGameRoom(dto.roomID);
    if (!room) throw 'Game not found';
    if (client.id !== room.currentPlayer.socketID) throw 'Not current player';

    room.currentPlayer.playerSymbol = dto.pickedSymbol;
    const otherSymbol = 3 - dto.pickedSymbol;
    room.getNextPlayer.playerSymbol = otherSymbol as Symbol;

    // cross has less symbols so player with cross is now currentPlayer
    if (dto.pickedSymbol === Symbol.Circle) {
      room.currentPlayer = room.getNextPlayer;
    }

    room.openingPhase = OpeningPhase.Done;

    const swapGameStonePickedDTO: SwapGameStonePickedDTO = {
      players: room.players,
      currentPlayer: room.currentPlayer,
    };
    server
      .to(dto.roomID)
      .emit(SocketIOEvents.SwapGameStonePicked, swapGameStonePickedDTO);
  }

  handleCustomAskForRematch(
    server: Server,
    client: Socket,
    oldRoomID: string,
    settings: CreateCustomDTO,
  ) {
    // TODO implement sensible rematch in custom games
    console.log('rematch');
    // if (oldRoomID in this.customRematch) {
    //   this.customRematch[oldRoomID]++;
    // } else {
    //   this.customRematch[oldRoomID] = 1;
    // }
    // if (this.customRematch[oldRoomID] === 2) {
    //   const { roomID } = this.createCustomGame(settings);
    //   server.to(oldRoomID).emit(SocketIOEvents.RedirectToCustomRematch, roomID);
    //   delete this.customRematch[oldRoomID];
    // }
  }

  handleGameDisconnect(server: Server, disconecteeSocket: Socket) {
    const roomID = this.findRoomIDBySocketID(disconecteeSocket.id);
    const room = this.findGameRoom(roomID);
    if (room === null) return;

    this.endGame(
      server,
      room,
      roomID,
      EndingType.Surrender,
      room.getOtherPlayer(disconecteeSocket.id),
    );
  }

  // ------------------- PRIVATE FUNCTIONS -------------------

  /**
   * Generates a room ID that doesn't conflict with any given room in *rooms* argument
   */
  private generateRoomID(length = 6) {
    for (let x = 0; x < 1000; x++) {
      const randID = Math.random()
        .toString(36)
        .substring(2, length)
        .toUpperCase();

      if (this.findGameRoom(randID) === null) return randID;
    }

    throw new InternalServerErrorException(
      'Ran out of attempts while generating room ID',
    );
  }

  private findGameRoom(roomID: string): AnyGame | null {
    return this.gameRooms[roomID] || null;
  }

  private findRoomIDBySocketID(socketID: string) {
    let foundRoomID = '';

    Object.keys(this.gameRooms).forEach((roomID) => {
      if (
        this.gameRooms[roomID].players.some((player) => {
          player.socketID === socketID;
        })
      )
        foundRoomID = roomID;
    });

    return foundRoomID;
  }

  private async constructPlayer(
    socketID: string,
    timeLimitInSeconds: number,
    userID?: number,
  ): Promise<Player> {
    const player: Player = {
      socketID,
      profileIcon: ProfileIcon.defaultBoy,
      username: '',
      timeLeft: timeLimitInSeconds * 1000,
      playerSymbol: 0,
    };
    if (userID) {
      const user = await this.usersService.findOneByID(userID);
      if (!user) throw 'User with given userID not found';
      player.profileIcon = user.settings.selectedIcon;
      player.username = user.username;
      player.userID = userID;
    } else {
      player.username = this.usersService.generateRandomName();
    }
    return player;
  }

  /**
   * Builds DTO containing starting player and players info (if logged)
   */
  private constructGameStartedDTO(game: AnyGame): GameStartedEventDTO {
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

  /**
   * function to be called every second; deducts time from current player and emits new times to all connected players
   */
  private async calibrateTime(server: Server, roomID: string, game: AnyGame) {
    // deducting one second from currentPlayer
    game.currentPlayer.timeLeft -= 1000;

    // sending new times to clients
    const timeCalibrationDTO: TimeCalibrationDTO = { players: game.players };
    server.to(roomID).emit(SocketIOEvents.TimeCalibration, timeCalibrationDTO);

    // checking if time has run out and possibly ending the game
    if (game.currentPlayer.timeLeft <= 0) {
      const winner = game.getNextPlayer;
      this.endGame(server, game, roomID, EndingType.Time, winner);
    }
  }

  private async endGame(
    server: Server,
    game: AnyGame,
    roomID: string,
    gameEnding: EndingType,
    winner?: Player,
  ) {
    clearInterval(game.calibrationIntervalHandle);
    game.setGameState(GameState.Ended);
    game.setGameEnding(gameEnding);
    if (gameEnding !== EndingType.Tie && winner) {
      game.winner = winner;
    }

    const gameEntity = await this.gameService.saveGame(game);
    const gameEndedDTO: GameEndedDTO = {
      endingType: gameEnding,
      winner: winner || undefined,
      userIDToEloDiff: game.gameType === GameType.Ranked ? {} : undefined,
      winningCombination: EndingType.Combination
        ? gameEntity.winningCombination
        : undefined,
    };
    console.log('GameEndedDTO:', gameEndedDTO);
    server.to(roomID).emit(SocketIOEvents.GameEnded, gameEndedDTO);
  }
}
