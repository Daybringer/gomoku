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

export interface UserProfile {
  username: string;
  gameBoard: GameBoard;
  myColor: string;
  enemyColor: string;
  nameChangeTokens: number;
}

// This serves as a placeholder and a default's for unlogged users
export function userBase(): User {
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
function getLocalUser(): User | null {
  const str = localStorage.getItem("user");
  if (str) {
    const user: User = JSON.parse(str);
    return user;
  } else {
    return null;
  }
}

export const useStore = defineStore("store", {
  state: () => ({
    user: getLocalUser() || userBase(),
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
  },
  actions: {
    /**
     * Warning: Owerwrites original data.
     * @returns
     * Deeply copies source user to destination user.\n\n
     * 
     */
    copyUser(src: User, dest: User): void {
      console.log("BEFORE", src, dest);
      Object.keys(src).forEach((key) => {
        if (Array.isArray(src[key])) {
          dest[key] = [...src[key]];
        } else {
          dest[key] = src[key];
        }
      })
      console.log("AFTER", src, dest);
    },
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
            this.user.username = newUsername;
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
          this.saveLocalUser();
          this.userLoaded = true;
          return user;
        })
        .catch((err) => console.log(err));
    },
    consumeAuthPayload(authPayload: AuthenticationPayload): void {
      const token = authPayload.payload.token;
      const user = authPayload.user;
      this.user = user;
      this.saveLocalUser();
      this.userLoaded = true;

      this.saveToken(token);
    },
    saveLocalUser() {
      const str = JSON.stringify(this.user);
      localStorage.setItem("user", str);
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
      localStorage.clear();
      this.token = "";
    },
  },
});
