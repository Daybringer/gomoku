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
  login(usernameOrEmail: string, password: string) {
    return Repository.post(`${resource}/login`, { usernameOrEmail, password });
  },
};
