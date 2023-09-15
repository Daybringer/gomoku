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
    username: "Anonymous",
    email: "",
    strategy: LoginStrategy.Local,
    achievements: [],
    admin: false,
    createdAt: new Date(),
    nameChangeTokens: 0,
    playerGameProfiles: [],
    premium: false,
    verified: false,
    settings: {
      id: 0,
      gameBoard: GameBoard.Standard,
      playerColor: "#00b3fe",
      opponentColor: "#ff2079",
      selectedIcon: ProfileIcon.transparent,
      availableIcons: [ProfileIcon.transparent],
    },
    statistics: {
      leaderboardPosition: 0,
      id: 0,
      quickLost: 0,
      quickTied: 0,
      quickWon: 0,
      rankedLost: 0,
      rankedTied: 0,
      rankedWon: 0,
    },
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

function isDarkModePreffered(): boolean {
  return (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

export const useProfileStore = defineStore("profileStore", {
  state: () => ({
    user: getLocalUser() || userBase(),
    defaults: {},
    userLoaded: false,
    darkModeToggled: isDarkModePreffered(),
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
    toggleDarkMode(): void {
      if (isDarkModePreffered()) {
        localStorage.setItem("theme", "light");
        this.darkModeToggled = false;
      } else {
        localStorage.setItem("theme", "dark");
        this.darkModeToggled = true;
      }
    },

    /**
     * <b>Warning</b>: Owerwrites original data.
     * <br>
     * Deeply copies source user to destination user.
     */
    copyUser(src: User, dest: User): void {
      Object.keys(src).forEach((key) => {
        if (Array.isArray(src[key])) {
          dest[key] = [...src[key]];
        } else {
          dest[key] = src[key];
        }
      });
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
     * @param newUsername
     * @returns
     */
    setUsername(newUsername: string): void {
      this.user.username = newUsername;
      this.saveUserToLocalStorage();
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
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch((err) => {
            this.googleIDToken = "";
            this.logout();
            reject(err.response.data ? err.response.data : err);
          });
      });
    },
    async fetchOwnProfile() {
      return UsersRepository.getOwnUserProfile()
        .then((res) => {
          const user = res.data;
          this.user = user;
          this.saveUserToLocalStorage();
          this.userLoaded = true;
          return user;
        })
        .catch();
    },
    consumeAuthPayload(authPayload: AuthenticationPayload): void {
      const token = authPayload.payload.token;
      const user = authPayload.user;
      this.user = user;
      this.saveUserToLocalStorage();
      this.userLoaded = true;

      this.saveToken(token);
    },
    saveUserToLocalStorage() {
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
      this.userLoaded = false;
      localStorage.clear();
      this.token = "";
    },
  },
});
