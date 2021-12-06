import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameState, WinCondition } from './game/game.class';
import { GameService } from './game/services/game.service';
import { SearchService } from './game/services/search.service';

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

      this.server.to(matchedPlayers[0]).emit('gameCreated', roomID);
      this.server.to(matchedPlayers[1]).emit('gameCreated', roomID);
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
    // I assume that findGameBySocketID always returns a game
    const game = this.gameService.findGameBySocketID(client.id);
    if (game.isRunning()) {
      console.log('Game is running and somebody left the game');
    } else {
      console.log('Game is over and somebody left the game');
    }
  }

  @SubscribeMessage('joinGame')
  handleMessage(
    client: Socket,
    clientData: { roomID: string; logged: boolean; username: string },
  ): void {
    const { roomID, logged, username } = clientData;

    if (this.gameService.roomExists(roomID)) {
      // Adds a players and starts game if the room is full
      this.gameService.addPlayer(roomID, client.id, logged, username);
      // Subscribing socket to socketIO room
      client.join(`${roomID}`);

      if (this.gameService.isRunning(roomID)) {
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
          // TODO implement time out scenario
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
