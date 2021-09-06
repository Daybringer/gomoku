import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game/game.service';

const quickSearch: string[] = [];

const activeSockets = {};

@WebSocketGateway({ namespace: '/search/quick' })
export class QuickSearchGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected QuickSearch: ${client.id}`);
    quickSearch.push(client.id);

    if (quickSearch.length >= 2) {
      const game = this.gameService.generateQuickGame();

      this.server.to(quickSearch[0]).emit('gameCreated', game.id);
      this.server.to(quickSearch[1]).emit('gameCreated', game.id);

      quickSearch.splice(0, 2);
    }
  }

  handleDisconnect(client: Socket) {
    if (quickSearch.includes(client.id)) {
      let indexOfSocket = quickSearch.indexOf(client.id);
      quickSearch.splice(indexOfSocket, 1);
    }
  }
}

@WebSocketGateway({ namespace: '/game/quick' })
export class GameGateway implements OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateway');
  constructor(private gameService: GameService) {}

  @WebSocketServer() server: Server;

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected GameGateway: ${client.id}`);
  }

  @SubscribeMessage('joinGame')
  handleMessage(
    client: Socket,
    clientData: { roomID: string; logged: boolean; username: string },
  ): void {
    const { roomID, logged, username } = clientData;
    for (let game in this.gameService.quickGames) {
      console.log(this.gameService.quickGames[game]);
      console.log('roomID:' + roomID);
    }
    if (this.gameService.roomExist(roomID)) {
      this.gameService.addPlayer(roomID, client.id, logged, username);
      if (this.gameService.isStarted(roomID)) {
        const gameInfo = this.gameService.getGameInfo(roomID);
        client.emit('gameStarted', gameInfo);
      }
    } else {
      client.emit('invalidRoomID');
    }
  }
}
