import { Injectable } from '@nestjs/common';
import { QuickGame, RankedGame, Player } from './game.class';

@Injectable()
export class GameService {
  quickGames: { [id: string]: QuickGame } = {};

  private generateRoomID(rooms: Object) {
    const IDLength = 6;
    for (let x = 0; x < 100; x++) {
      let randID = Math.random().toString(36).substr(2, IDLength).toUpperCase();
      if (!rooms.hasOwnProperty(randID)) {
        return randID;
      }
    }
    throw 'generateRoomID overlooped';
  }

  generateQuickGame() {
    const roomID = this.generateRoomID(this.quickGames);
    const newQuickGame = new QuickGame(roomID);
    this.quickGames[newQuickGame.id] = newQuickGame;
    return newQuickGame;
  }

  roomExist(roomID: string): boolean {
    return this.quickGames.hasOwnProperty(roomID);
  }

  getGameInfo(roomID: string) {
    const players = this.quickGames[roomID].players;
    return { players };
  }

  isStarted(roomID: string): boolean {
    return this.quickGames[roomID].gameState === 'RUNNING';
  }

  addPlayer(
    roomID: string,
    socketID: string,
    logged: boolean,
    username: string,
  ) {
    const player: Player = { socketID, username, logged };
    if (!this.quickGames[roomID].isFull())
      this.quickGames[roomID].addPlayer(player);
  }
}
