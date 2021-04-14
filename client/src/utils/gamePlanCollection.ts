import { GamePlan } from "./types.dt";

export default class GamePlanCollection {
  private gamePlans: GamePlan[] = [];

  public async fetchGamePlans(url: string) {
    const json = await this.fetchJSON(url);
    this.gamePlans = json.gamePlans;
  }

  public randomizeOrder() {
    const reorderedGamePlans: GamePlan[] = [];
    while (this.gamePlans.length !== 0) {
      const randomIndex = Math.floor(Math.random() * this.gamePlans.length);
      reorderedGamePlans.push(this.gamePlans.splice(randomIndex, 1)[0]);
    }
    this.gamePlans = reorderedGamePlans;
  }

  public getGamePlans = (): GamePlan[] => this.gamePlans;

  private async fetchJSON(url: string) {
    const response = await fetch(url, {
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.log("HTTP-Error: " + response.status);
    }
  }
}
