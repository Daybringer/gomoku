import { defineStore } from "pinia";
import Repository from "../repositories/Repository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { AxiosResponse } from "axios";
const AuthRepository = RepositoryFactory.getAuthRepository;

interface UserProfile {
  username: string;
  gameBoard: string;
}

export const useStore = defineStore({
  id: "store",
  state: () => ({
    userProfile: { username: "", gameBoard: "" },
    token: localStorage.getItem("access-token") || "",
    googleIDToken: "",
    refreshToken: "",
  }),
  getters: {
    isAuthenticated(): boolean {
      return !!this.token;
    },
    getUserProfile(): UserProfile {
      return this.userProfile;
    },
    getUsername(): string {
      return this.userProfile.username;
    },
  },
  actions: {
    async register(user: {
      username: string;
      email: string;
      password: string;
      passwordConfirm: string;
    }) {
      return new Promise((resolve, reject) => {
        AuthRepository.registerUser(user)
          .then((res) => {
            this.consumeAuthResponse(res);
            resolve("Registered");
          })
          .catch((err) => {
            this.logout();
            reject(err.response.data.message);
          });
      });
    },
    async login(usernameOrEmail: string, password: string) {
      return new Promise((resolve, reject) => {
        AuthRepository.login(usernameOrEmail, password)
          .then((res) => {
            this.consumeAuthResponse(res);
            resolve("Logged in");
          })
          .catch((err) => {
            this.logout();
            reject(err.response.data.message);
          });
      });
    },
    consumeAuthResponse(response: AxiosResponse): void {
      const data = response.data.data;
      const token = data.payload.token;
      this.saveUserProfile(data.user);
      this.saveToken(token);
    },
    saveToken(token: string): void {
      localStorage.setItem("access-token", token);
      Repository.defaults.headers.common["Authorization"] = token;
      this.token = token;
    },
    saveUserProfile(userProfile: UserProfile) {
      this.userProfile = userProfile;
    },
    flushUserProfile() {
      this.userProfile = { username: "", gameBoard: "" };
    },
    logout(): void {
      this.flushUserProfile();
      localStorage.removeItem("access-token");
      this.token = "";
    },
  },
});
