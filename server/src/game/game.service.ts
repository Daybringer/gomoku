import { Injectable } from '@nestjs/common';
import { QuickGame, RankedGame, Player, GameState } from './game.class';

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
    const startingPlayer = this.quickGames[roomID].getStartingPlayer();
    return { players, startingPlayer };
  }

  isStarted(roomID: string): boolean {
    return this.quickGames[roomID].gameState === 'RUNNING';
  }

  startGame(roomID: string): Player {
    this.quickGames[roomID].setGameState(GameState.running);
    return this.quickGames[roomID].selectRandomStartingPlayer();
  }

  addPlayer(
    roomID: string,
    socketID: string,
    logged: boolean,
    username: string,
  ): void {
    const player: Player = { socketID, username, logged };
    if (!this.quickGames[roomID].isFull())
      this.quickGames[roomID].addPlayer(player);
    if (
      this.quickGames[roomID].isFull() &&
      !this.quickGames[roomID].isStarted()
    )
      this.startGame(roomID);
  }
}
