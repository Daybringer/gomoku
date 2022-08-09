import { EndingType, GameState, Opening, Player } from '../shared/types';
import { GameType } from '../shared/types';

abstract class Game {
  players: Player[] = [];
  winner: Player;
  startingPlayer: Player;
  round = 0;
  gameboardSize = 15;
  gameboard: number[][] = this.generateGameboard(this.gameboardSize);
  turns: Array<[number, number]> = [];
  gameType: GameType;
  opening: Opening;
  timeLimitInSeconds: number;
  gameState: GameState = GameState.Waiting;
  gameEnding: EndingType;
  lastCalibrationTimestamp: number;
  timeoutHandleID: NodeJS.Timeout;
  calibrationIntervalHandle: NodeJS.Timer;

  addPlayer(player: Player): void {
    if (this.isWaiting())
      if (this.players.length < 2) {
        if (this.players[0]) {
          // Player with same username tries to log in
          if (this.players[0].username === player.username && player.username) {
            throw 'Are you a schizophrenic?';
          }
        }
        player.timeLeft = this.timeLimitInSeconds * 1000;
        this.players.push(player);
      } else {
        throw 'Game is already full';
      }
  }

  selectRandomStartingPlayer(): Player {
    const startingPlayer = this.players[Math.round(Math.random())];
    this.startingPlayer = startingPlayer;
    return startingPlayer;
  }

  getPlayerOnTurn(): Player {
    return this.round % 2 == 0
      ? this.startingPlayer
      : this.players[Math.abs(this.players.indexOf(this.startingPlayer) - 1)];
  }

  getNextPlayerOnTurn(): Player {
    return this.round % 2 == 1
      ? this.startingPlayer
      : this.players[Math.abs(this.players.indexOf(this.startingPlayer) - 1)];
  }

  setWinner(winnerSocketID: string): void {
    this.players.forEach((player) => {
      if (player.socketID == winnerSocketID) this.winner = player;
    });
  }

  getOtherPlayersIDByFirstOnes(firstOneID: string): string {
    let id = '';
    this.players.forEach((player) => {
      if (player.socketID !== firstOneID) {
        id = player.socketID;
      }
    });
    return id;
  }

  isFull(): boolean {
    return this.players.length >= 2;
  }

  isWaiting(): boolean {
    return this.gameState === GameState.Waiting;
  }

  isRunning(): boolean {
    return this.gameState === GameState.Running;
  }

  isEnded(): boolean {
    return this.gameState === GameState.Ended;
  }

  setGameState(gameState: GameState): void {
    this.gameState = gameState;
  }

  setGameEnding(gameEnding: EndingType): void {
    this.gameEnding = gameEnding;
  }

  iterateRound(): void {
    this.round++;
  }

  saveTurn(position: [number, number]): void {
    this.turns.push(position);
  }

  private generateGameboard(size: number): number[][] {
    const gameboard: number[][] = [];
    for (let i = 0; i < size; i++) {
      gameboard.push([]);
      for (let ii = 0; ii < size; ii++) {
        gameboard[i].push(0);
      }
    }
    return gameboard;
  }
}

class QuickGame extends Game {
  timeLimitInSeconds = 2 * 60;
  gameType = GameType.Quick;
}

class RankedGame extends Game {
  timeLimitInSeconds = 3 * 60;
  eloDiff: number = 0;
  gameType = GameType.Ranked;
}

class CustomGame extends Game {
  gameType = GameType.Custom;
}

type AnyGame = QuickGame | RankedGame | CustomGame;

export { QuickGame, RankedGame, AnyGame };
