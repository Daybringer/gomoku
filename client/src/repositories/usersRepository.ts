import Repository from "./Repository";

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
    return Repository.get(`${resource}/profile`);
  },
  getRandomName() {
    return Repository.post(`${resource}/generate-name`);
  },
};
