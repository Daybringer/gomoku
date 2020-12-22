import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserInterface as User } from 'src/users/models/user.interface';
import { NamelessGUserRepositoryService } from 'src/users/namelessGUserRepository.service';
import { UsersRepositoryService } from 'src/users/usersRepository.service';

import { LogInDTO } from './dto/log-in.dto';
import { SignUpDTO } from './dto/sign-up.dto';

import { OAuth2Client } from 'google-auth-library';
import { NamelessGUser } from 'src/users/models/namelessGUser.interface';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepositoryService: UsersRepositoryService,
    private readonly namelessGUserRepositoryService: NamelessGUserRepositoryService,
  ) {}

  async generateJWT(user: User): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 13);
  }

  async validateGoogleID(googleIDToken: string) {
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    const ticket = await client.verifyIdToken({
      idToken: googleIDToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  }

  public async validateGoogleUser(email: string): Promise<User> {
    return this.userRepositoryService.findOneByEmail(email);
  }

  async namelessGoogleExists(email: string): Promise<NamelessGUser> {
    return this.namelessGUserRepositoryService.findOneByEmail(email);
  }

  async createNamelessGoogle(
    email: string,
    googleID: string,
  ): Promise<NamelessGUser> {
    return this.namelessGUserRepositoryService.create(email, googleID);
  }

  async setGoogleUsername(username: string, email: string): Promise<User> {
    return this.userRepositoryService
      .findOneByUsername(username)
      .then((user) => {
        if (user) {
          throw new Error('Username is already taken');
        } else {
          return this.userRepositoryService
            .create(username, email, '')
            .then((user) => {
              return this.namelessGUserRepositoryService
                .deleteOneByEmail(email)
                .then(() => {
                  return user;
                });
            });
        }
      });
  }

  async comparePassword(
    newPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(newPassword, passwordHash);
  }

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.userRepositoryService.create(
      username,
      email,
      hashedPassword,
    );
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
          if (user.googleID)
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
