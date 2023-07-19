import { defineStore } from "pinia";

function getCampaignProgress(): number {
  const progress = localStorage.getItem("campaignProgress");
  if (progress) return Number(progress);
  return 0;
}

export const useCampaignStore = defineStore("campaignStore", {
  state: () => ({
    progress: getCampaignProgress(),
  }),
  actions: {
    setCampaignProgress(ix: number) {
      this.progress = ix;
      localStorage.setItem("campaignProgress", `${ix}`);
    },
    iterate() {
      this.progress++;
      localStorage.setItem("campaignProgress", `${this.progress}`);
    },
  },
});
