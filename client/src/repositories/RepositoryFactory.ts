import usersRepository from "./usersRepository";
import authRepository from "./authRepository";
import gameRepository from "./gameRepository";

const repositories = {
  users: usersRepository,
  auth: authRepository,
  games: gameRepository
};

export const RepositoryFactory = {
  // get: (name: string) => repositories[name],
  getUserRepository: repositories["users"],
  getAuthRepository: repositories["auth"],
  getGameRepository: repositories["games"]
};
