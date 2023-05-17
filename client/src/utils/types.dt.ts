interface Options {
  drawSpeed: number;
  gridLineWidth: number; // in pixels
  cellSize: number;
  primaryColor: string;
  secondaryColor: string;
  gridColor: string;
}

interface GamePlan {
  positionOrder: number[][];
  winStroke: number[][];
  width: number;
  height: number;
}
enum GameState {
  Waiting = "waiting",
  Coinflip = "coinflip",
  Running = "running",
  Ended = "ended",
}


export { Options, GamePlan, GameState };
