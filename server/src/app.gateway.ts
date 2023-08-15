import {
  RedirectToCustomRematchDTO,
  SearchQuickGameDTO,
} from 'src/shared/socketIO';
import { SendMessageDTO } from 'src/shared/socketIO';
import { GameRoomService } from './game/services/gameRoom.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game/services/game.service';
import {
  SearchService,
  RankedQueueMember,
} from './game/services/search.service';

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
import { GameType } from './shared/types';
import { UnauthorizedException } from '@nestjs/common';

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
    this.currentlyOnline++;
    const updateActiveUsersDTO: UpdateActiveUsersDTO = {
      activeUsers: this.currentlyOnline,
    };
    this.server.emit(SocketIOEvents.UpdateActiveUsers, updateActiveUsersDTO);
  }

  handleDisconnect() {
    this.currentlyOnline--;
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
    private gameRoomService: GameRoomService,
    private customRoomService: CustomRoomService,
  ) {}
  @WebSocketServer() server: Server;

  // Waiting rooms
  @SubscribeMessage(SocketIOEvents.CustomRoomJoined)
  handleCustomRoomJoined(
    client: Socket,
    customRoomJoined: CustomRoomJoinedDTO,
  ) {
    const { waitingRoomID } = customRoomJoined;
    this.customRoomService.joinCustomWaitingRoom(client, waitingRoomID);

    if (this.customRoomService.isCustomWaitingRoomFull(waitingRoomID)) {
      const { roomID } = this.gameRoomService.createGameRoom(
        GameType.Custom,
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
export class QuickSearchGateway implements OnGatewayDisconnect {
  constructor(
    private gameRoomService: GameRoomService,
    private searchService: SearchService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage(SocketIOEvents.SearchQuickGame)
  searchQuickGame(client: Socket, dto: SearchQuickGameDTO): void {
    this.searchService.joinQuickQueue(client.id, dto.userID);
    const matchedPlayers = this.searchService.tryToMatchPlayersQuickQueue(
      client.id,
      dto.userID,
    );
    if (matchedPlayers !== null) {
      const { roomID } = this.gameRoomService.createGameRoom(GameType.Quick);
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
    private gameRoomService: GameRoomService,
    private searchService: SearchService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage(SocketIOEvents.SearchRankedGame)
  async searchRankedGame(client: Socket, dto: SearchRankedGameDTO) {
    let member: RankedQueueMember;
    try {
      member = await this.searchService.verifyJwt(client.id, dto.jwtToken);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    this.searchService.joinRankedQueue(member);
    member.searchIntervalID = setInterval(() => {
      const players = this.searchService.tryToMatchPlayersRankedQueue(
        member,
        10,
      );
      if (players) {
        players[0].socketID;
        clearInterval(member.searchIntervalID);
        const { roomID } = this.gameRoomService.createGameRoom(GameType.Ranked);
        this.server
          .to(players[0].socketID)
          .emit(SocketIOEvents.GameCreated, roomID);
        this.server
          .to(players[1].socketID)
          .emit(SocketIOEvents.GameCreated, roomID);
      } else {
        member.numberOfSearchAttempts++;
      }
    }, 1000);
  }

  handleDisconnect(client: Socket) {
    this.searchService.leaveRankedQueue(client.id);
  }
}

// GAME
@WebSocketGateway({ namespace: '/game' })
export class GameGateway implements OnGatewayDisconnect {
  constructor(
    private gameRoomService: GameRoomService,
    private customRoomService: CustomRoomService,
  ) {}

  @WebSocketServer() server: Server;

  async handleDisconnect(client: Socket) {
    console.log('disconnect', client, client.id);
    this.gameRoomService.handleGameDisconnect(this.server, client);
  }

  @SubscribeMessage(SocketIOEvents.ToServerSwapPickGameStone)
  handlePickGameStone(client: Socket, dto: ToServerSwapPickGameStoneDTO): void {
    this.gameRoomService
      .handlePickGameStone(this.server, client, dto)
      .catch((err: string) => console.log(err));
  }

  @SubscribeMessage(SocketIOEvents.JoinGame)
  handleJoinGame(client: Socket, joinGameDTO: JoinGameDTO): void {
    console.log('joined');
    this.gameRoomService
      .handleJoinGameRoom(this.server, client, joinGameDTO)
      .catch();
  }

  @SubscribeMessage(SocketIOEvents.GameClick)
  hangleGameClick(client: Socket, gameClickDTO: GameClickDTO): void {
    this.gameRoomService
      .handleGameClick(this.server, client, gameClickDTO)
      .catch((err) => {
        console.log(err);
      });
  }

  @SubscribeMessage(SocketIOEvents.SendMessage)
  handleSendMessage(socket: Socket, dto: SendMessageDTO): void {
    this.gameRoomService.handleSendMessage(dto.roomID, dto.message, socket);
  }

  @SubscribeMessage(SocketIOEvents.AskForRematch)
  handleCustomAskForRematch(socket: Socket, dto: AskForRematchDTO): void {
    const waitingRoomID = this.customRoomService.createCustomWaitingRoom({
      gameSettings: dto.settings,
    });
    const rematchDTO: RedirectToCustomRematchDTO = {
      askeeSocketID: socket.id,
      waitingRoomID,
    };
    this.server
      .to(dto.oldRoomID)
      .emit(SocketIOEvents.RedirectToCustomRematch, rematchDTO);
  }
}
