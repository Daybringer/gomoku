import Repository from "./Repository";
import { User } from "../shared/interfaces/user.interface";

const resource = "/users";
export default {
  userWithMailExists(email: string) {
    return Repository.post(`${resource}/check-email`, { email });
  },
  userWithUsernameExists(username: string) {
    return Repository.post(`${resource}/check-username`, { username });
  },
  // getUserProfile() {},
  getOwnUserProfile() {
    return Repository.get<User>(`${resource}/profile`);
  },
  getRandomName() {
    return Repository.post(`${resource}/generate-name`);
  },
  changeUsername(username: string) {
    return Repository.post(`${resource}/change-username`, { username });
  },
};
