import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/models/user.entity';

import { UserInterface as User } from 'src/users/models/user.interface';
import { UsersRepositoryService } from 'src/users/usersRepository.service';
import { Repository } from 'typeorm';
import { LogInDTO } from './dto/log-in.dto';
import { SignUpDTO } from './dto/sign-up.dto';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userRepositoryService: UsersRepositoryService,
  ) {}

  async generateJWT(user: User): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 13);
  }

  async comparePassword(
    newPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(newPassword, passwordHash);
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = hashedPassword;
    const user = await this.userRepository.save(newUser);
    if (user) {
      const { password, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  async register(
    registerUserDTO: SignUpDTO,
  ): Promise<{ user: User | null; errors: string[] }> {
    const { username, email, password } = registerUserDTO;

    // TODO IDK why but this code looks like shit, it really does...
    // ? REVISION: refactored a little bit, still the nested returns look a little bit odd
    return this.userRepositoryService
      .findOneByUsername(username.toLowerCase())
      .then((user) => {
        if (user) {
          return {
            user: null,
            errors: ['Username is already taken'],
          };
        } else {
          return this.userRepositoryService
            .findOneByEmail(email.toLowerCase())
            .then((user) => {
              if (user) {
                return {
                  user: null,
                  errors: ['Email is already in use'],
                };
              } else {
                return this.createUser(username, email, password).then(
                  (user) => {
                    return {
                      user,
                      errors: [],
                    };
                  },
                );
              }
            });
        }
      });
  }

  async login(loginUserDTO: LogInDTO): Promise<User> {
    const { usernameOrEmail, password } = loginUserDTO;
    return this.validateUser(usernameOrEmail, password)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw new UnauthorizedException('Invalid Credentials');
      });
  }

  async validateUser(usernameOrEmail, password): Promise<User> {
    return this.userRepositoryService
      .findByEmailOrUsername(usernameOrEmail)
      .then((user) => {
        if (!user) {
          throw Error;
        } else {
          return this.comparePassword(password, user.password).then(
            (passwordsMatch) => {
              if (passwordsMatch) {
                const { password, ...result } = user;
                return result;
              } else {
                throw Error;
              }
            },
          );
        }
      });
  }
}
