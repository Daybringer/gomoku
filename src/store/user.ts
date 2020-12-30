import { defineStore } from "pinia";

interface UserProfile {
  username: string;
  gameBoard: string;
}

export const userProfileStore = defineStore({
  id: "auth",
  state: () => ({
    userProfile: { username: "", gameBoard: "" },
  }),
  getters: {
    getUsername() {
      return this.userProfile.username;
    },
  },
  actions: {
    saveUserProfile(user: UserProfile) {
      this.userProfile = user;
    },
    flushUserProfile() {
      (this.userProfile.gameBoard = ""), (this.userProfile.username = "");
    },
  },
});
