import { defineStore } from "pinia";
import Repository from "../repositories/Repository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
const UsersRepository = RepositoryFactory.getUserRepository;
const AuthRepository = RepositoryFactory.getAuthRepository;
import { LoginStrategy } from "../shared/types";
import { ProfileIcon } from "@/shared/icons";

// @Types
import { AuthenticationPayload, GameBoard } from "../shared/types";
import { User } from "@/shared/interfaces/user.interface";
import { getTransitionRawChildren } from "vue";

export interface UserProfile {
  username: string;
  gameBoard: GameBoard;
  myColor: string;
  enemyColor: string;
  nameChangeTokens: number;
}

// This serves as a placeholder and a default's for unlogged users
function userBase(): User {
  return {
    id: 0,
    elo: 1000,
    credit: 0,
    username: "",
    email: "",
    strategy: LoginStrategy.Local,
    achievements: [],
    gameBoard: GameBoard.Standard,
    playerColor: "#00b3fe",
    enemyColor: "#ff2079",
    selectedIcon: ProfileIcon.transparent,
    availableIcons: [ProfileIcon.transparent],
    quickLost: 0,
    quickTied: 0,
    quickWon: 0,
    rankedLost: 0,
    rankedTied: 0,
    rankedWon: 0,
  };
}

// FIXME userProfile vs User type << unnecessary type,
// but there might have been problems with inner interfaces
export const useStore = defineStore("store", {
  state: () => ({
    user: userBase(),
    userLoaded: false,
    token: localStorage.getItem("access-token") || "",
    googleIDToken: "",
    refreshToken: "",
  }),
  getters: {
    isAuthenticated(): boolean {
      return !!this.token;
    },
    getUsername(): string {
      return this.user.username;
    },
    // Matches
    getTotalQuick(): number {
      return this.user.quickLost + this.user.quickTied + this.user.quickWon;
    },
    getTotalRanked(): number {
      return this.user.rankedLost + this.user.rankedTied + this.user.rankedWon;
    },
    getTotalMatches(): number {
      return this.getTotalQuick + this.getTotalRanked;
    },
    getTotalWon(): number {
      return this.user.rankedWon + this.user.quickWon;
    },
    getTotalLost(): number {
      return this.user.rankedLost + this.user.quickLost;
    },
    getTotalTie(): number {
      return this.user.rankedTied + this.user.quickTied;
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

            if (this.user.nameChangeTokens! > 0) {
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
      return UsersRepository.getOwnUserProfile()
        .then((res) => {
          const user = res.data;
          this.user = user;
          this.userLoaded = true;
          return user;
        })
        .catch((err) => console.log(err));
    },
    consumeAuthPayload(authPayload: AuthenticationPayload): void {
      const token = authPayload.payload.token;
      const user = authPayload.user;
      this.user = user;
      this.userLoaded = true;

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
    flushUser(): void {
      this.user = userBase();
    },
    logout(): void {
      this.flushUser();
      localStorage.removeItem("access-token");
      this.token = "";
    },
  },
});
