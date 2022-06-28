import { AuthenticationPayload } from "../shared/types";
import Repository from "./Repository";

const resource = "/auth";
export default {
  registerUser(user: {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) {
    return Repository.post(`${resource}/register`, user);
  },
  verifyMail(verificationCode: string, username: string) {
    return Repository.post(
      `${resource}/verify?code=${verificationCode}&username=${username}`
    );
  },
  login(usernameOrEmail: string, password: string) {
    return Repository.post<AuthenticationPayload>(`${resource}/login`, {
      usernameOrEmail,
      password,
    });
  },
  googleLogin(id_token: string) {
    return Repository.post<AuthenticationPayload>(`${resource}/google`, {
      id_token,
    });
  },
  setUsername(username: string) {
    return Repository.post(`${resource}/set-username`, { username });
  },
};
