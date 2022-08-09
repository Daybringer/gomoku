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
@WebSocketGateway({ namespace: '/game/quick' })
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
