import {
  EndingType,
  GameState,
  Opening,
  OpeningPhase,
  Player,
  Position,
  Symbol,
} from '../shared/types';
import { GomokuBoard } from 'gomoku-game';
import { GameType } from '../shared/types';

abstract class Game {
  players: Player[] = [];
  winner: Player;
  startingPlayer: Player;
  currentPlayer: Player;
  round = 0;
  gameboard: GomokuBoard;
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

  get board(): [number, number][] {
    return this.gameboard.getBoard() as [number, number][];
  }

  getSymbolAt(position: Position): Symbol {
    return this.gameboard.getStone(...position);
  }

  isPositionEmpty(position: Position): boolean {
    return this.gameboard.isPositionEmpty(...position);
  }

  saveTurn(position: [number, number]): void {
    this.turns.push(position);
  }

  placeStone(position: Position, symbol: Symbol): void {
    this.gameboard.setStone(...position, symbol);
    this.saveTurn(position);
  }

  /**
   * Adds player if game is still not running and not full
   */
  addPlayer(player: Player): void {
    if (!this.isWaiting) throw 'Game is already running/ended';
    if (this.isFull) throw 'Game is already full';

    this.players.push(player);
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
    this.currentPlayer.playerSymbol = Symbol.Circle;
    this.getNextPlayer.playerSymbol = Symbol.Cross;
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
}

class QuickGame extends Game {
  constructor() {
    super();
    this.timeLimitInSeconds = 2 * 60;
    this.gameType = GameType.Quick;
    this.opening = Opening.Standard;
    this.openingPhase = OpeningPhase.Done;
    this.gameboard = new GomokuBoard(15, 15, 5, true);
  }
}

class RankedGame extends Game {
  // eloDiff only applies on symmetrical ELO ranking (Zero sum game of loser/winners ELO gains/loses)
  eloDiff: number;
  playerUserIDs: [number, number];
  constructor() {
    super();
    this.timeLimitInSeconds = 3 * 60;
    this.gameType = GameType.Ranked;
    this.opening = Opening.Swap1;
    this.openingPhase = OpeningPhase.Place3;
    this.gameboard = new GomokuBoard(15, 15, 5, true);
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
    this.gameboard = new GomokuBoard(15, 15, 5, true);

    if (this.opening === Opening.Swap1) {
      this.openingPhase = OpeningPhase.Place3;
    } else {
      this.openingPhase = OpeningPhase.Done;
    }
  }
}

type AnyGame = QuickGame | RankedGame | CustomGame;

export { QuickGame, RankedGame, CustomGame, AnyGame };
