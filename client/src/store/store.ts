import { defineStore } from "pinia";
import Repository from "../repositories/Repository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
const UsersRepository = RepositoryFactory.getUserRepository;
const AuthRepository = RepositoryFactory.getAuthRepository;

// @Types
import { AuthenticationPayload, GameBoard } from "../shared/types";

export interface UserProfile {
  username: string;
  gameBoard: GameBoard;
  myColor: string;
  enemyColor: string;
  nameChangeTokens: number;
}

function userProfileBase(): UserProfile {
  return {
    username: "",
    gameBoard: GameBoard.Standard,
    myColor: "#00b3fe",
    enemyColor: "#ff2079",
    nameChangeTokens: 0,
  };
}

// FIXME userProfile vs User type << unnecessary type,
// but there might have been problems with inner interfaces
export const useStore = defineStore("store", {
  state: () => ({
    userProfile: userProfileBase(),
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
            resolve("Registered");
          })
          .catch((err) => {
            this.logout();
            console.log(err);
            reject(err);
          });
      });
    },
    /**
     *
     * @param verificationCode
     * @param username
     * @returns
     */
    async verifyMail(verificationCode: string, username: string) {
      return new Promise<any>((resolve, reject) => {
        AuthRepository.verifyMail(verificationCode, username)
          .then((res) => resolve(res))
          .catch((err) => reject(err.response.data.message));
      });
    },
    /**
     *
     * @returns
     */
    async getRandomName() {
      return new Promise<string>((resolve, reject) => {
        UsersRepository.getRandomName()
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    /**
     *
     * @param newUsername
     * @returns
     */
    async setUsername(newUsername: string): Promise<string> {
      return new Promise((resolve, reject) => {
        UsersRepository.changeUsername(newUsername)
          .then(() => {
            resolve("Username has been changed");
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data.message);
          });
      });
    },
    async login(usernameOrEmail: string, password: string) {
      return new Promise((resolve, reject) => {
        AuthRepository.login(usernameOrEmail, password)
          .then((res) => {
            this.consumeAuthPayload(res.data);
            resolve("Logged in");
          })
          .catch((err) => {
            this.logout();
            reject(err.response.data.message);
          });
      });
    },
    /**
     *
     * @param id_token token extracted from Google login flow
     * @returns Rejected on incorrect google token.
     * Resolved with `true` when `nameChangeTokens > 0` meaning that
     * a user has just registered with one-click.
     * Otherway resolved with `false`.
     */
    async googleLogin(id_token: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        AuthRepository.googleLogin(id_token)
          .then((res) => {
            this.consumeAuthPayload(res.data);

            if (this.userProfile.nameChangeTokens > 0) {
              console.log("Store true");
              resolve(true);
            } else {
              console.log("Store false");
              resolve(false);
            }
          })
          .catch((err) => {
            this.googleIDToken = "";
            this.logout();
            console.log("2");
            reject(err.response.data ? err.response.data : err);
          });
      });
    },
    async fetchOwnProfile() {
      // TODO complete user info + user config
      UsersRepository.getOwnUserProfile()
        .then((res) => {
          const user = res.data;
          this.userProfile.username = user.username;
        })
        .catch((err) => console.log(err));
    },
    consumeAuthPayload(authPayload: AuthenticationPayload): void {
      const token = authPayload.payload.token;
      const userProfile = userProfileBase();
      const user = authPayload.user;

      userProfile.username = user.username;
      userProfile.gameBoard = user.gameBoard;
      userProfile.nameChangeTokens = user.nameChangeTokens!;

      this.saveUserProfile(userProfile);
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
      this.userProfile = userProfileBase();
    },
    logout(): void {
      this.flushUserProfile();
      localStorage.removeItem("access-token");
      this.token = "";
    },
  },
});
