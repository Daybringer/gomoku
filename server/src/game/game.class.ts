import {
  EndingType,
  GameState,
  Opening,
  OpeningPhase,
  Player,
  Position,
  Symbol,
} from '../shared/types';
import { GameType } from '../shared/types';

abstract class Game {
  players: Player[] = [];
  winner: Player;
  startingPlayer: Player;
  currentPlayer: Player;
  round = 0;
  gameboardSize = 15;
  gameboard: Symbol[][] = this.generateGameboard(this.gameboardSize);
  turns: Position[] = [];
  gameType: GameType;
  opening: Opening;
  openingPhase: OpeningPhase;
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

  get getNextPlayer(): Player {
    return this.getOtherPlayer(this.currentPlayer.socketID);
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

  saveTurn(position: [number, number]): void {
    this.turns.push(position);
  }

  placeStone(position: Position, symbol: Symbol): void {
    this.setSymbolAt(position, symbol);
    this.saveTurn(position);
  }

  /**
   * Adds player if game is still not running and not full
   */
  addPlayer(player: Player): void {
    if (this.isWaiting)
      if (!this.isFull) {
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
   * selects starting player and assigns symbol
   */
  selectRandomStartingPlayer(): void {
    const startingPlayer = this.players[Math.round(Math.random())];
    this.startingPlayer = startingPlayer;
    this.currentPlayer = startingPlayer;
    this.currentPlayer.playerSymbol = 1;
    this.getNextPlayer.playerSymbol = 2;
  }

  getOtherPlayer(socketID: string): Player {
    const [foo, bar] = this.players;
    if (foo.socketID === socketID) return bar;
    return foo;
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
  constructor() {
    super();
    this.timeLimitInSeconds = 2 * 60;
    this.gameType = GameType.Quick;
    this.openingPhase = OpeningPhase.Done;
  }
}

class RankedGame extends Game {
  eloDiff: number;
  constructor() {
    super();
    this.timeLimitInSeconds = 3 * 60;
    this.eloDiff = 0;
    this.gameType = GameType.Ranked;
    this.opening = Opening.Swap1;
    this.openingPhase = OpeningPhase.Place3;
  }
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
    this.gameType = GameType.Custom;

    if (this.opening === Opening.Swap1) {
      this.openingPhase = OpeningPhase.Place3;
    } else {
      this.openingPhase = OpeningPhase.Done;
    }
  }
}

type AnyGame = QuickGame | RankedGame | CustomGame;

export { QuickGame, RankedGame, CustomGame, AnyGame };
