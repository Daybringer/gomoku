import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game/services/game.service';
import { SearchService } from './game/services/search.service';

// DTOs
import {
  GameClickDTO,
  JoinGameDTO,
  SocketIOEvents,
  CreateCustomDTO,
  CustomCreatedDTO,
  CustomRoomJoinedDTO,
  CustomRoomRedirectToGameDTO,
  UpdateActiveUsersDTO,
  ToServerSwapPickGameStoneDTO,
  SearchRankedGameDTO,
  GameEndedDTO,
  AskForRematchDTO,
} from './shared/socketIO';
import { CustomRoomService } from './game/services/customRoom.service';
import { EndingType, GameType } from 'gomoku-shared-types/';

// Whole site things - current people online...
@WebSocketGateway({
  namespace: '/app',
})
export class GeneralGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}
  @WebSocketServer() server: Server;
  currentlyOnline = 0;

  handleConnection() {
    this.currentlyOnline += 1;
    const updateActiveUsersDTO: UpdateActiveUsersDTO = {
      activeUsers: this.currentlyOnline,
    };
    this.server.emit(SocketIOEvents.UpdateActiveUsers, updateActiveUsersDTO);
  }

  handleDisconnect() {
    this.currentlyOnline -= 1;
    const updateActiveUsersDTO: UpdateActiveUsersDTO = {
      activeUsers: this.currentlyOnline,
    };
    this.server.emit(SocketIOEvents.UpdateActiveUsers, updateActiveUsersDTO);
  }
}

// Create custom gateway
@WebSocketGateway({ namespace: '/custom' })
export class CreateCustomGateway {
  constructor(private customRoomService: CustomRoomService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage(SocketIOEvents.CreateCustomWaiting)
  handleCreateCustom(client: Socket, createCustomDTO: CreateCustomDTO) {
    const waitingRoomID =
      this.customRoomService.createCustomWaitingRoom(createCustomDTO);
    const customCreatedDTO: CustomCreatedDTO = { roomID: waitingRoomID };
    client.emit(SocketIOEvents.CustomWaitingCreated, customCreatedDTO);
  }
}

// Custom waiting room gateway
@WebSocketGateway({ namespace: '/custom/waiting' })
export class CustomWaitingGateway implements OnGatewayDisconnect {
  constructor(
    private gameService: GameService,
    private customRoomService: CustomRoomService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage(SocketIOEvents.CustomRoomJoined)
  handleCustomRoomJoined(
    client: Socket,
    customRoomJoined: CustomRoomJoinedDTO,
  ) {
    const { waitingRoomID } = customRoomJoined;
    this.customRoomService.joinCustomWaitingRoom(client, waitingRoomID);

    if (this.customRoomService.isCustomWaitingRoomFull(waitingRoomID)) {
      const { roomID } = this.gameService.createCustomGame(
        this.customRoomService.getGameSettings(waitingRoomID),
      );
      const sockets =
        this.customRoomService.getAllWaitingPlayersIDs(waitingRoomID);

      const customRoomRedirectToGame: CustomRoomRedirectToGameDTO = { roomID };
      sockets.forEach((socket) => {
        socket.emit(
          SocketIOEvents.CustomRoomRedirectToGame,
          customRoomRedirectToGame,
        );
      });
      this.customRoomService.deleteCustomWaitingRoom(waitingRoomID);
    }
  }

  handleDisconnect(client: Socket) {
    const roomID =
      this.customRoomService.findCustomWaitingRoomIDBySocket(client);
    if (roomID) {
      this.customRoomService.deleteCustomWaitingRoom(roomID);
    }
  }
}

// SEARCH
@WebSocketGateway({ namespace: '/search/quick' })
export class QuickSearchGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private gameService: GameService,
    private searchService: SearchService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    this.searchService.joinQuickQueue(client.id);
    const matchedPlayers = this.searchService.tryMatchPlayersQuickQue();
    if (matchedPlayers !== null) {
      const { roomID } = this.gameService.generateQuickGameRoom();

      this.server
        .to(String(matchedPlayers[0]))
        .emit(SocketIOEvents.GameCreated, roomID);
      this.server
        .to(String(matchedPlayers[1]))
        .emit(SocketIOEvents.GameCreated, roomID);
    }
  }

  handleDisconnect(client: Socket) {
    this.searchService.leaveQuickQueue(client.id);
  }
}

@WebSocketGateway({ namespace: '/search/ranked' })
export class RankedSearchGateway implements OnGatewayDisconnect {
  constructor(
    private gameService: GameService,
    private searchService: SearchService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage(SocketIOEvents.SearchRankedGame)
  async searchRankedGame(client: Socket, dto: SearchRankedGameDTO) {
    //TODO implement proper Ranked matchmaking
    const member = await this.searchService.verifyJwt(client.id, dto.jwtToken);
    this.searchService.joinRankedQueue(member);
    const matchedPlayers = this.searchService.tryMatchPlayersRankedQue();
    if (matchedPlayers !== null) {
      const [alice, bob] = matchedPlayers;
      const { roomID } = this.gameService.generateRankedGameRoom([
        alice.userID,
        bob.userID,
      ]);

      this.server.to(bob.socketID).emit(SocketIOEvents.GameCreated, roomID);
      this.server.to(alice.socketID).emit(SocketIOEvents.GameCreated, roomID);
    }
  }

  handleDisconnect(client: Socket) {
    this.searchService.leaveRankedQueue(client.id);
  }
}

// GAME
@WebSocketGateway({ namespace: '/game' })
export class GameGateway implements OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  @WebSocketServer() server: Server;

  async handleDisconnect(client: Socket) {
    const { game, roomID } = this.gameService.findGameBySocketID(client.id);
    if (game) {
      if (game.isRunning) {
        this.gameService.endGameDisconnect(game, client);

        const winner = game.getOtherPlayer(client.id);
        let elos = {};

        if (game.gameType === GameType.Ranked) {
          elos = await this.gameService.calcElo(
            game.players[0].userID,
            game.players[1].userID,
            false,
            game.getOtherPlayer(client.id).userID,
          );
        }

        const dto: GameEndedDTO = {
          endingType: EndingType.Surrender,
          winner: winner,
          userIDToEloDiff: elos || {},
        };
        this.server.to(roomID).emit(SocketIOEvents.GameEnded, dto);
      }
    }
  }

  @SubscribeMessage(SocketIOEvents.ToServerSwapPickGameStone)
  handlePickGameStone(client: Socket, dto: ToServerSwapPickGameStoneDTO): void {
    this.gameService
      .handlePickGameStone(this.server, client, dto)
      .catch((err: string) => console.log(err));
  }

  @SubscribeMessage(SocketIOEvents.JoinGame)
  handleJoinGame(client: Socket, joinGameDTO: JoinGameDTO): void {
    this.gameService
      .handleJoinGame(this.server, client, joinGameDTO)
      .catch((err: string) => console.log(err));
  }

  @SubscribeMessage(SocketIOEvents.GameClick)
  hangleGameClick(client: Socket, gameClickDTO: GameClickDTO): void {
    this.gameService
      .handleGameClick(this.server, client, gameClickDTO)
      .catch((err: string) => console.log(err));
  }

  @SubscribeMessage(SocketIOEvents.SendMessage)
  handleSendMessage(socket: Socket, message: string): void {
    this.gameService.handleSendMessage(this.server, socket, message);
  }

  @SubscribeMessage(SocketIOEvents.AskForRematch)
  handleCustomAskForRematch(socket: Socket, dto: AskForRematchDTO): void {
    this.gameService.handleCustomAskForRematch(
      this.server,
      socket,
      dto.oldRoomID,
      dto.createCustomDTO,
    );
  }
}
