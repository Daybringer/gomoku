import { defineStore } from "pinia";
import Repository from "../repositories/Repository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { AxiosResponse } from "axios";
const AuthRepository = RepositoryFactory.getAuthRepository;

interface UserProfile {
  username: string;
  gameBoard: string;
  myColor: string;
  enemyColor: string;
}

export const useStore = defineStore({
  id: "store",
  state: () => ({
    userProfile: {
      username: "",
      gameBoard: "",
      myColor: "#00b3fe",
      enemyColor: "#ff2079",
    },
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
    async verifyMail(verificationCode: string, username: string) {
      return new Promise((resolve, reject) => {
        AuthRepository.verifyMail(verificationCode, username)
          .then((res) => resolve(res))
          .catch((err) => reject(err.response.data.message));
      });
    },
    async setGUsername(username: string) {
      return new Promise((resolve, reject) => {
        AuthRepository.setGUsername(this.googleIDToken, username)
          .then((res) => {
            console.log(res);
            this.googleIDToken = "";
            this.consumeAuthResponse(res);
            resolve("Logged in");
          })
          .catch((err) => {
            console.log(err);
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
    async googleLogin(id_token: string) {
      return new Promise((resolve, reject) => {
        AuthRepository.googleLogin(id_token)
          .then((res) => {
            if (res.data) {
              this.consumeAuthResponse(res);
              resolve(true);
            } else {
              this.googleIDToken = id_token;
              resolve(false);
            }
          })
          .catch((err) => {
            this.googleIDToken = "";
            this.logout();
            reject(err.response.data.message);
          });
      });
    },
    consumeAuthResponse(response: AxiosResponse): void {
      const data = response.data;
      const token = data.payload.token;
      this.saveUserProfile(data.user);
      this.saveToken(token);
    },
    saveToken(token: string): void {
      localStorage.setItem("access-token", token);
      this.setBearer(token);
      this.token = token;
    },
    setBearer(token: string) {
      Object.assign(Repository.defaults, {
        headers: { Authorization: "Bearer " + token },
      });
    },
    saveUserProfile(userProfile: UserProfile) {
      this.userProfile = userProfile;
    },
    flushUserProfile() {
      this.userProfile = {
        username: "",
        gameBoard: "",
        myColor: "#00b3fe",
        enemyColor: "#ff2079",
      };
    },
    logout(): void {
      this.flushUserProfile();
      localStorage.removeItem("access-token");
      this.token = "";
    },
  },
});
