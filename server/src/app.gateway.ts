import {
  OnGatewayConnection,
  OnGatewayDisconnect,
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
  GameEvents,
  JoinGameDTO,
  SearchEvents,
} from 'gomoku-shared-types/';
import {
  SocketIOEvents,
  CreateCustomDTO,
  CustomCreatedDTO,
  CustomRoomJoinedDTO,
  CustomRoomRedirectToGameDTO,
  UpdateActiveUsersDTO,
} from './shared/socketIO';
import { CustomRoomService } from './game/services/customRoom.service';

// Whole site things - current people online...
@WebSocketGateway({ namespace: '/app' })
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
        .emit(SearchEvents.GameCreated, roomID);
      this.server
        .to(String(matchedPlayers[1]))
        .emit(SearchEvents.GameCreated, roomID);
    }
  }

  handleDisconnect(client: Socket) {
    this.searchService.leaveQuickQueue(client.id);
  }
}

// GAME
@WebSocketGateway({ namespace: '/game' })
export class GameGateway implements OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  @WebSocketServer() server: Server;

  handleDisconnect(client: Socket) {
    const { game, roomID } = this.gameService.findGameBySocketID(client.id);
    if (game) {
      if (game.isRunning()) {
        this.gameService.endGameDisconnect(game, client.id);
        this.server
          .to(roomID)
          .emit(GameEvents.GameEndedByDisconnect, client.id);
      }
    }
  }

  @SubscribeMessage(GameEvents.JoinGame)
  handleJoinGame(client: Socket, joinGameDTO: JoinGameDTO): void {
    this.gameService.handleJoinGame(this.server, client, joinGameDTO);
  }

  @SubscribeMessage(GameEvents.GameClick)
  hangleGameClick(client: Socket, gameClickDTO: GameClickDTO): void {
    this.gameService.handleGameClick(this.server, client, gameClickDTO);
  }
  @SubscribeMessage(GameEvents.SendMessage)
  handleSendMessage(socket: Socket, message: string): void {
    this.gameService.handleSendMessage(this.server, socket, message);
  }
}
