import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameState, GameEnding } from './game/game.class';
import { GameService } from './game/services/game.service';
import { SearchService } from './game/services/search.service';

// DTOs
import { GameClickDTO, GameEvents, SearchEvents } from 'gomoku-shared-types/';

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

      this.server.to(matchedPlayers[0]).emit(SearchEvents.GameCreated, roomID);
      this.server.to(matchedPlayers[1]).emit(SearchEvents.GameCreated, roomID);
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
        this.gameService.endGameDisconnect(client.id, roomID);
        this.server
          .to(roomID)
          .emit(GameEvents.GameEndedByDisconnect, client.id);
      }
    }
  }

  @SubscribeMessage(GameEvents.JoinGame)
  handleMessage(
    client: Socket,
    clientData: { roomID: string; logged: boolean; username: string },
  ): void {
    const { roomID, logged, username } = clientData;

    if (this.gameService.roomExists(roomID)) {
      // Adds a players and starts game if the room is full
      this.gameService.addPlayer(roomID, client.id, logged, username);
      // Subscribing socket to socketIO room
      client.join(roomID);

      if (this.gameService.isRunning(roomID)) {
        const gameInfo = this.gameService.getGameInfo(roomID);
        this.server.to(roomID).emit(GameEvents.GameStarted, gameInfo);
      }
    } else {
      client.emit(GameEvents.InvalidRoomID);
    }
  }

  @SubscribeMessage(GameEvents.GameClick)
  hangleGameClick(client: Socket, clientData: GameClickDTO): void {
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

        this.server.to(roomID).emit(GameEvents.StonePlaced, turnData);

        this.gameService.iterateRound(roomID);

        const currGameState = this.gameService.checkWin(position, roomID);

        if (currGameState === GameEnding.Combination) {
          const winner = this.gameService.playerOnTurn(roomID);
          this.gameService.endGame(currGameState, roomID, winner.socketID);
          this.server
            .to(roomID)
            .emit(GameEvents.GameEndedByCombination, winner.socketID);
        } else if (currGameState === GameEnding.Tie) {
          this.gameService.endGame(currGameState, roomID);
          this.server.to(roomID).emit(GameEvents.GameEndedByTie);
        }
      } catch (error) {
        client.emit(error);
      }
    } else {
      client.emit('notPlayersTurn');
    }
  }
}
