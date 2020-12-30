import { defineStore } from "pinia";
import Repository from "../repositories/Repository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { AxiosResponse } from "axios";
const AuthRepository = RepositoryFactory.getAuthRepository;

export const userAuthStore = defineStore({
  id: "auth",
  state: () => ({
    token: localStorage.getItem("access-token") || "",
    googleIDToken: "",
    refreshToken: "",
  }),
  getters: {
    isAuthenticated(): boolean {
      return !!this.token;
    },
  },
  actions: {
    async register(user: {
      username: string;
      email: string;
      password: string;
      passwordConfirm: string;
    }) {
      return AuthRepository.registerUser(user)
        .then((res) => {
          console.log("auth - correct");
          console.log(res);
          this.consumeAuthResponse(res);
          return "this is very nice response";
        })
        .catch((err) => {
          console.log("auth - error");
          console.log(err);
          console.log(
            err.response,
            err.response.data,
            // THE CORRECT ONE
            err.response.data.message
          );
          this.logout();
          return err;
        });
    },
    consumeAuthResponse(response: AxiosResponse) {
      const data = response.data.data;
      const token = data.payload.token;

      // user.saveUserProfile(data.user);

      this.saveToken(token);
    },
    saveToken(token: string) {
      localStorage.setItem("access-token", token);
      Repository.defaults.headers.common["Authorization"] = token;
      this.token = token;
    },
    logout() {
      // user.flushUserProfile();
      localStorage.removeItem("access-token");
      this.token = "";
    },
  },
});
