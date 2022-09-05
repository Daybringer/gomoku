import { Socket } from 'socket.io';
import {
  EndingType,
  GameState,
  Opening,
  Player,
  Position,
  Symbol,
} from '../shared/types';
import { GameType } from '../shared/types';

abstract class Game {
  players: Player[] = [];
  winner: Player;
  startingPlayer: Player;
  round = 0;
  gameboardSize = 15;
  gameboard: Symbol[][] = this.generateGameboard(this.gameboardSize);
  turns: Array<[number, number]> = [];
  gameType: GameType;
  opening: Opening;
  timeLimitInSeconds: number;
  hasTimeLimit: boolean = true;
  gameState: GameState = GameState.Waiting;
  gameEnding: EndingType;
  calibrationIntervalHandle: NodeJS.Timer;

  get isRunning(): boolean {
    return this.gameState === GameState.Running;
  }

  get isFull(): boolean {
    return this.players.length >= 2;
  }
  get isWaiting(): boolean {
    return this.gameState === GameState.Waiting;
  }

  get isEnded(): boolean {
    return this.gameState === GameState.Ended;
  }

  get playerOnTurn(): Player {
    return this.round % 2 == 0
      ? this.startingPlayer
      : this.players[Math.abs(this.players.indexOf(this.startingPlayer) - 1)];
  }

  get getNextPlayerOnTurn(): Player {
    return this.round % 2 == 1
      ? this.startingPlayer
      : this.players[Math.abs(this.players.indexOf(this.startingPlayer) - 1)];
  }

  getSymbolAt(position: Position): Symbol {
    return this.gameboard[position[0]][position[1]];
  }

  setSymbolAt(position: Position, symbol: Symbol): void {
    this.gameboard[position[0]][position[1]] = symbol;
  }

  isPositionEmpty(position: Position): boolean {
    return this.getSymbolAt(position) === 0;
  }

  /**
   * Adds player if game is still not running and not full
   */
  addPlayer(player: Player): void {
    if (this.isWaiting)
      if (!this.isFull) {
        player.timeLeft = this.timeLimitInSeconds * 1000;
        this.players.push(player);
      } else {
        throw 'Game is already full';
      }
  }

  /**
   * Sets game state to running and chooses and sets starting player
   */
  start(): void {
    this.gameState = GameState.Running;
    this.selectRandomStartingPlayer();
  }

  /**
   *
   */
  isPlayersTurn(playerSocket: Socket): boolean {
    return this.playerOnTurn.socket === playerSocket;
  }

  /**
   *
   */
  selectRandomStartingPlayer(): void {
    const startingPlayer = this.players[Math.round(Math.random())];
    this.startingPlayer = startingPlayer;
  }

  getOtherPlayer(playerSocket: Socket): Player {
    let otherPlayer: Player;
    this.players.forEach((curr) => {
      if (curr.socket.id !== playerSocket.id) otherPlayer = curr;
    });
    return otherPlayer;
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

  private generateGameboard(size: number): Symbol[][] {
    const gameboard: Symbol[][] = [];
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
  opening = Opening.Swap1;
}

class CustomGame extends Game {
  constructor(
    hasTimeLimit: boolean,
    timeLimitInSeconds: number,
    opening: Opening,
  ) {
    super();
    this.timeLimitInSeconds = timeLimitInSeconds;
    this.opening = opening;
    this.hasTimeLimit = hasTimeLimit;
  }
  gameType = GameType.Custom;
}

type AnyGame = QuickGame | RankedGame | CustomGame;

export { QuickGame, RankedGame, CustomGame, AnyGame };
