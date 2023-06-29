import GamePlanCollection from "./gamePlanCollection";
import { GamePlan, Options } from "./types.dt";

export default class GameSimulation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isInitialized: boolean;
  private options: {
    drawSpeed: number;
    gridLineWidth: number; // in pixels
    cellSize: number;
    primaryColor: string;
    secondaryColor: string;
    gridColor: string;
  };
  //   Debouncing
  private debounceHandle = 0;
  private debounceTime = 1000; // ms
  //   Loop
  private abort = false;
  private GamePlanCollection = new GamePlanCollection();
  // Grid info
  private nX = 0;
  private nY = 0;
  private pX = 0;
  private pY = 0;

  constructor(options: Options) {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d", {
      alpha: false,
    }) as CanvasRenderingContext2D;
    this.canvas = canvas;
    this.ctx = ctx;
    this.isInitialized = false;
    this.debounceTime = 1001 * options.drawSpeed; // Ensures that debounce is higher than time between placed stones -> no more bugs with many interfering games

    this.options = options;
  }

  public async initialize(canvasID: string) {
    const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    this.canvas = canvas;
    this.ctx = ctx;
    this.isInitialized = true;

    this.resizeHandle();

    window.addEventListener("resize", this._debounceResize);
  }

  public destroy() {
    this.abort = true;
    window.removeEventListener("resize", this._debounceResize);
  }

  private _debounceResize = () => {
    clearTimeout(this.debounceHandle);

    this.abort = true;

    this.debounceHandle = window.setTimeout(() => {
      this.resizeHandle();
    }, this.debounceTime);
  };

  private resizeHandle() {
    this.canvas.width = document.getElementById("mainCard")
      ?.clientWidth as number;
    this.canvas.height = document.getElementById("mainCard")
      ?.clientHeight as number;

    this.abort = false;
    this.simulationLoop();
  }

  private async simulationLoop() {
    while (!this.abort) {
      // clearing canvas
      this.clearCanvas(this.canvas, this.ctx);

      const fetchPromise =
        this.GamePlanCollection.fetchGamePlans("gamePlans.json");

      this.drawGrid();

      await fetchPromise;

      // assigning grid positions
      const parceledPlans = this.parcel(this.GamePlanCollection.getGamePlans());

      await this.drawPlans(parceledPlans);
    }
    return;
  }

  private parcel(gamePlans: GamePlan[]): GamePlan[] {
    const parceledPlans: GamePlan[] = [];
    const parceledPositions: {
      width: number;
      height: number;
      origin: number[];
    }[] = [];

    for (let i = 0; i < gamePlans.length; i++) {
      const { width, height } = gamePlans[i];

      for (let j = 0; j < 100; j++) {
        const origin = this.generateRandomOrigin(
          height,
          width,
          this.nX,
          this.nY
        );
        if (origin === -1) break;

        if (
          this.isOriginAvailable(
            origin as number[],
            width,
            height,
            parceledPositions
          )
        ) {
          const parceledPositionOrder = gamePlans[i].positionOrder.map(
            (position) => [+position[0] + origin[0], +position[1] + origin[1]]
          );

          gamePlans[i].positionOrder = parceledPositionOrder;

          parceledPlans.push(gamePlans[i]);
          parceledPositions.push({ origin, width, height });
          break;
        }
      }
    }

    return parceledPlans;
  }

  private generateRandomOrigin(
    planHeight: number,
    planWidth: number,
    nX: number,
    nY: number
  ) {
    if (planHeight > nY || planWidth > nX) return -1;

    const originX = Math.floor(Math.random() * (nX - planWidth));
    const originY = Math.floor(Math.random() * (nY - planHeight));
    return [originX, originY];
  }

  private isOriginAvailable(
    origin: number[],
    width: number,
    height: number,
    parceledPositions: {
      width: number;
      height: number;
      origin: number[];
    }[]
  ): boolean {
    if (parceledPositions.length === 0) return true;
    for (let x = 0; x < parceledPositions.length; x++) {
      if (
        !(
          origin[0] + width < parceledPositions[x].origin[0] ||
          origin[0] > parceledPositions[x].origin[0] + width ||
          origin[1] + height < parceledPositions[x].origin[1] ||
          origin[1] > parceledPositions[x].origin[1] + height
        )
      ) {
        return false;
      }
    }
    return true;
  }

  private async drawPlans(gamePlans: GamePlan[]) {
    if (this.abort) return;
    await this.wait(1000);

    for (let i = 0; i < gamePlans.length; i++) {
      for (let j = 0; j < gamePlans[i].positionOrder.length; j++) {
        if (this.abort) return;
        if (j % 2 === 0) {
          this.drawCircle(gamePlans[i].positionOrder[j]);
        } else {
          this.drawCross(gamePlans[i].positionOrder[j]);
        }
        await this.wait(1000 * this.options.drawSpeed);
      }
    }
  }

  private clearCanvas(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  }

  private wait = (delay) =>
    new Promise<void>((resolve) => setTimeout(resolve, delay));

  // calculated position is return in the center of a cell
  private calculatePosition(gridPosition: number[]): number[] {
    return [
      gridPosition[0] * this.options.cellSize +
        this.pX -
        this.options.cellSize / 2,
      gridPosition[1] * this.options.cellSize +
        this.pY -
        this.options.cellSize / 2,
    ];
  }

  // render methods
  private drawGrid() {
    this.ctx.strokeStyle = this.options.gridColor;

    this.ctx.lineWidth = this.options.gridLineWidth;

    const padding = 1; // in cells

    this.nX = Math.floor(
      this.canvas.clientWidth / this.options.cellSize - padding
    );
    this.nY = Math.floor(
      this.canvas.clientHeight / this.options.cellSize - padding
    );

    this.pX = Math.floor(
      (this.canvas.clientWidth - this.nX * this.options.cellSize) / 2
    );
    this.pY = Math.floor(
      (this.canvas.clientHeight - this.nY * this.options.cellSize) / 2
    );

    this.ctx.beginPath();
    for (
      let x = this.pX;
      x <= this.canvas.clientWidth - this.pX;
      x += this.options.cellSize
    ) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.clientHeight);
    }

    for (
      let y = this.pY;
      y <= this.canvas.clientHeight - this.pY;
      y += this.options.cellSize
    ) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.clientWidth, y);
    }
    this.ctx.stroke();
  }

  private drawCircle(gridPosition: number[]) {
    const calculatedPosition = this.calculatePosition(gridPosition);

    const strokeWidth = 5;

    this.ctx.beginPath();
    this.ctx.arc(
      calculatedPosition[0],
      calculatedPosition[1],
      this.options.cellSize / 2 - strokeWidth - this.options.gridLineWidth,
      0,
      2 * Math.PI,
      false
    );

    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeStyle = this.options.secondaryColor;
    this.ctx.stroke();
  }

  private drawCross(gridPosition: number[]) {
    const calculatedPosition = this.calculatePosition(gridPosition);

    const strokeWidth = 5;

    this.ctx.beginPath();
    // const offCenter =
    //   Math.sqrt(
    //     Math.pow(this.options.cellSize / 2, 2) +
    //       Math.pow(this.options.cellSize / 2, 2)
    //   ) -
    //   strokeWidth / 2 -
    //   20 / this.options.gridLineWidth;

    const radius = this.options.cellSize / 2;

    const hypotenuse = Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2));

    this.ctx.moveTo(
      calculatedPosition[0] - hypotenuse / 2,
      calculatedPosition[1] - hypotenuse / 2
    );
    this.ctx.lineTo(
      calculatedPosition[0] + hypotenuse / 2,
      calculatedPosition[1] + hypotenuse / 2
    );

    this.ctx.moveTo(
      calculatedPosition[0] - hypotenuse / 2,
      calculatedPosition[1] + hypotenuse / 2
    );
    this.ctx.lineTo(
      calculatedPosition[0] + hypotenuse / 2,
      calculatedPosition[1] - hypotenuse / 2
    );

    this.ctx.lineCap = "round";
    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeStyle = this.options.primaryColor;
    this.ctx.stroke();
  }
}
