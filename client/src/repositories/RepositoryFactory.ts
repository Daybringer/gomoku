import usersRepository from "./usersRepository";
import authRepository from "./authRepository";

const repositories = {
  users: usersRepository,
  auth: authRepository
};

export const RepositoryFactory = {
  // TODO not flexible way, v podstatě potlačuje princip Factories -_-
  // get: (name: string) => repositories[name],
  getUserRepository: repositories["users"],
  getAuthRepository: repositories["auth"]
};
