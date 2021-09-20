import { Injectable } from '@nestjs/common';
import {
  QuickGame,
  RankedGame,
  Player,
  GameState,
  WinCondition,
} from './game.class';

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

  playerOnTurn(roomID: string): Player {
    const game = this.quickGames[roomID];
    return game.round % 2 == 0
      ? game.getStartingPlayer()
      : game.players[
          Math.abs(game.players.indexOf(game.getStartingPlayer()) - 1)
        ];
  }

  isPlayersTurn(socketID: string, roomID: string): boolean {
    return this.playerOnTurn(roomID).socketID === socketID;
  }

  placeStone(
    position: [number, number],
    socketID: string,
    roomID: string,
  ): void {
    const game = this.quickGames[roomID];
    if (game.isStarted()) {
      if (game.gameboard[position[0]][position[1]] === 0) {
        game.gameboard[position[0]][position[1]] =
          game.getStartingPlayer().socketID === socketID ? 1 : 2;
        game.saveTurn(position);
      } else {
        throw 'takenPosition';
      }
    } else {
      throw 'gameNotRunning';
    }
  }

  iterateRound(roomID: string) {
    this.quickGames[roomID].iterateRound();
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

  checkWin(position: number[], roomID: string) {
    const game = this.quickGames[roomID];
    const round = game.round;
    const gamePlan = game.gameboard;

    const [xPos, yPos] = position;
    const tile = round % 2 ? 1 : 2;
    let horizont = 0;
    let vertical = 0;
    let diagonalR = 0;
    let diagonalL = 0;
    for (let x = -4; x < 5; x++) {
      // * Horizontal check
      if (xPos + x >= 0 && xPos + x <= 14) {
        if (gamePlan[xPos + x][yPos] === tile) {
          horizont++;
        } else {
          horizont = 0;
        }
      }
      if (yPos + x >= 0 && yPos + x <= 14) {
        if (gamePlan[xPos][yPos + x] === tile) {
          vertical++;
        } else {
          vertical = 0;
        }
      }
      if (yPos + x >= 0 && yPos + x <= 14 && xPos + x >= 0 && xPos + x <= 14) {
        if (gamePlan[xPos + x][yPos + x] === tile) {
          diagonalR++;
        } else {
          diagonalR = 0;
        }
      }
      if (yPos + x >= 0 && yPos + x <= 14 && xPos - x >= 0 && xPos - x <= 14) {
        if (gamePlan[xPos - x][yPos + x] === tile) {
          diagonalL++;
        } else {
          diagonalL = 0;
        }
      }
      if (horizont >= 5 || vertical >= 5 || diagonalL >= 5 || diagonalR >= 5) {
        return GameState.win;
      }
    }
    if (horizont >= 5 || vertical >= 5 || diagonalL >= 5 || diagonalR >= 5) {
      return GameState.win;
    } else if (round === 225) {
      return GameState.tie;
    } else {
      return GameState.running;
    }
  }

  endGame(winCondition: WinCondition, isTie: boolean, roomID: string): void {
    const game = this.quickGames[roomID];
    game.setGameState(isTie ? GameState.tie : GameState.win);
    game.winCondition = winCondition;
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
