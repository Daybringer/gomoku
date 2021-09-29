import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameState, WinCondition } from './game/game.class';
import { GameService } from './game/game.service';

const quickSearch: string[] = [];

const activeSockets = {};

@WebSocketGateway({ namespace: '/search/quick' })
export class QuickSearchGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private gameService: GameService) {}

  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    // this.logger.log(`Client connected QuickSearch: ${client.id}`);
    quickSearch.push(client.id);

    if (quickSearch.length >= 2) {
      const { roomID } = this.gameService.generateQuickGameRoom();

      this.server.to(quickSearch[0]).emit('gameCreated', roomID);
      this.server.to(quickSearch[1]).emit('gameCreated', roomID);

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

    if (this.gameService.roomExists(roomID)) {
      this.gameService.addPlayer(roomID, client.id, logged, username);
      client.join(`${roomID}`);
      if (this.gameService.isStarted(roomID)) {
        const gameInfo = this.gameService.getGameInfo(roomID);
        this.server.to(`${roomID}`).emit('gameStarted', gameInfo);
      }
    } else {
      client.emit('invalidRoomID');
    }
  }

  @SubscribeMessage('gameClick')
  hangleGameClick(
    client: Socket,
    clientData: { roomID: string; position: [number, number] },
  ): void {
    const { roomID, position } = clientData;
    if (this.gameService.isPlayersTurn(client.id, roomID)) {
      try {
        this.gameService.placeStone(position, client.id, roomID);

        clearTimeout(this.gameService.getTimeoutHandle(roomID));

        setTimeout(() => {
          console.log('no time');
          // this.server.to(`${roomID}`).emit('gameEnded')
        }, this.gameService.switchTime(roomID));

        const playerOnTurn = this.gameService.playerOnTurn(roomID);

        const turnData = {
          position,
          updatedPlayerTime: {
            socketID: playerOnTurn.socketID,
            time: playerOnTurn.secondsLeft,
          },
        };

        console.log(turnData, ' :turnData');

        this.server.to(`${roomID}`).emit('stonePlaced', turnData);

        this.gameService.iterateRound(roomID);

        const currGameState = this.gameService.checkWin(position, roomID);

        if (currGameState === GameState.win) {
          this.gameService.endGame(WinCondition.combination, false, roomID);
          this.server
            .to(`${roomID}`)
            .emit('gameEnded', this.gameService.playerOnTurn(roomID).socketID);
        } // else if(currGameState === GameState.tie){

        // }
      } catch (error) {
        console.log(error);
        client.emit(error);
      }
    } else {
      client.emit('notPlayersTurn');
    }
  }
}
