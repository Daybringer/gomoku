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
import { SearchEvents } from 'gomoku-shared-types/';
import {
  GameClickDTO,
  JoinGameDTO,
  SocketIOEvents,
  CreateCustomDTO,
  CustomCreatedDTO,
  CustomRoomJoinedDTO,
  CustomRoomRedirectToGameDTO,
  UpdateActiveUsersDTO,
  GameEndedByDisconnectDTO,
  ToServerSwapPickGameStoneDTO,
  SearchRankedGameDTO,
} from './shared/socketIO';
import { CustomRoomService } from './game/services/customRoom.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Client } from 'socket.io/dist/client';

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

  handleDisconnect(client: Socket) {
    const { game, roomID } = this.gameService.findGameBySocketID(client.id);
    if (game) {
      if (game.isRunning) {
        this.gameService.endGameDisconnect(game, client);
        const gameEndedByDisconnectDTO: GameEndedByDisconnectDTO = {
          winner: game.getOtherPlayer(client.id),
        };
        this.server
          .to(roomID)
          .emit(SocketIOEvents.GameEndedByDisconnect, gameEndedByDisconnectDTO);
      }
    }
  }

  @SubscribeMessage(SocketIOEvents.ToServerSwapPickGameStone)
  handlePickGameStone(client: Socket, dto: ToServerSwapPickGameStoneDTO): void {
    this.gameService.handlePickGameStone(this.server, client, dto);
  }

  @SubscribeMessage(SocketIOEvents.JoinGame)
  handleJoinGame(client: Socket, joinGameDTO: JoinGameDTO): void {
    this.gameService.handleJoinGame(this.server, client, joinGameDTO);
  }

  @SubscribeMessage(SocketIOEvents.GameClick)
  hangleGameClick(client: Socket, gameClickDTO: GameClickDTO): void {
    this.gameService.handleGameClick(this.server, client, gameClickDTO);
  }
  @SubscribeMessage(SocketIOEvents.SendMessage)
  handleSendMessage(socket: Socket, message: string): void {
    this.gameService.handleSendMessage(this.server, socket, message);
  }
}
