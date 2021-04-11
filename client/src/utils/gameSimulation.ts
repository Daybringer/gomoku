import { Options } from "./gameSimulation.types";

export default class GameSimulation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isInitialized: boolean;
  private options: Options;
  //   Debouncing
  private debounceHandle = 0;
  private debounceTime = 300;
  //   Loop
  private loopIntervalHandle = 0;
  constructor(options: Options) {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d", {
      alpha: false,
    }) as CanvasRenderingContext2D;
    this.canvas = canvas;
    this.ctx = ctx;
    this.isInitialized = false;

    this.options = options;
  }

  public initialize(canvasID: string) {
    const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    this.canvas = canvas;
    this.ctx = ctx;
    this.isInitialized = true;

    this.resizeHandle();

    window.addEventListener("resize", this._debounceResize);
  }

  public destroy() {
    window.removeEventListener("resize", this._debounceResize);
  }

  private _debounceResize = () => {
    clearTimeout(this.debounceHandle);
    this.clearCanvas(this.canvas, this.ctx);
    this.debounceHandle = setTimeout(() => {
      this.resizeHandle();
    }, this.debounceTime);
  };

  private resizeHandle() {
    this.canvas.width = document.getElementById("mainCard")
      ?.clientWidth as number;
    this.canvas.height = document.getElementById("mainCard")
      ?.clientHeight as number;
    this.drawGrid();
  }

  private clearCanvas(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  }

  //   private _initGameLoop = ()=> {

  //   }

  //   private gameLoop() {}

  private drawGrid() {
    this.ctx.strokeStyle = "rgba(31, 41, 55, 1)";

    this.ctx.lineWidth = this.options.gridLineWidth;

    console.log(this.canvas.clientHeight, this.canvas.clientWidth);

    const padding = 1; // in cells

    const nX = Math.floor(
      this.canvas.clientWidth / this.options.cellSize - padding
    );
    const nY = Math.floor(
      this.canvas.clientHeight / this.options.cellSize - padding
    );

    const pX = Math.floor(
      (this.canvas.clientWidth - nX * this.options.cellSize) / 2
    );
    const pY = Math.floor(
      (this.canvas.clientHeight - nY * this.options.cellSize) / 2
    );

    this.ctx.beginPath();
    for (
      let x = pX;
      x <= this.canvas.clientWidth - pX;
      x += this.options.cellSize
    ) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.clientHeight);
    }

    for (
      let y = pY;
      y <= this.canvas.clientHeight - pY;
      y += this.options.cellSize
    ) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.clientWidth, y);
    }
    this.ctx.stroke();
    // this.ctx.translate(-0.5, -0.5);
  }
}
