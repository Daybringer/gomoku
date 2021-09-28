enum GameType {
  ranked = 'RANKED',
  quick = 'QUICK',
  custom = 'CUSTOM',
}

enum GameState {
  waiting = 'WAITING',
  running = 'RUNNING',
  win = 'WIN',
  tie = 'TIE',
}

enum WinCondition {
  combination = 'COMBINATION',
  time = 'TIME',
  disconnect = 'DISCONNECT',
}

enum Opening {
  standart = 'STANDART',
  swap = 'SWAP',
  swap2 = 'SWAP2',
}

interface Player {
  socketID: string;
  username: string;
  logged: boolean;
  secondsLeft?: number;
}

abstract class Game {
  players: Player[] = [];
  winner: Player;
  startingPlayer: Player;
  round: number = 0;
  gameboardSize: number = 15;
  gameboard: number[][] = this.generateGameboard(this.gameboardSize);
  turns: Array<[number, number]> = [];
  gameType: GameType;
  gameState: GameState;
  opening: Opening;
  timeLimitInSeconds: number;
  calibrationTimestamp: number;
  winCondition: WinCondition;

  addPlayer(player: Player): void {
    if (this.players.length < 2) {
      if (this.players[0]) {
        if (this.players[0].username === player.username && player.username) {
          throw 'Are you a schizophrenic?';
        }
      }
      player.secondsLeft = this.timeLimitInSeconds;
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

  isFull(): boolean {
    return this.players.length >= 2;
  }

  isStarted(): boolean {
    return this.gameState === GameState.running;
  }

  setGameState(gameState: GameState): void {
    this.gameState = gameState;
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
}

class RankedGame extends Game {
  timeLimitInSeconds = 3 * 60;
  eloDiff: number = 0;
}

export {
  QuickGame,
  RankedGame,
  GameType,
  GameState,
  WinCondition,
  Opening,
  Player,
};
