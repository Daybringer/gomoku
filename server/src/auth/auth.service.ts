import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/models/user.entity';
// DTOs
import { LogInDTO } from './dto/log-in.dto';
import { SignUpDTO } from './dto/sign-up.dto';

// Mails
import { MailService } from '../mail/mail.service';

import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 13);
  }

  public async findUserByEmail(email: string): Promise<UserEntity> {
    return this.usersService.findOneByEmail(email);
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
  ): Promise<UserEntity> {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersService.createLocal(
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

  async register(signUpDTO: SignUpDTO): Promise<UserEntity> {
    const { username, email, password } = signUpDTO;

    return this.usersService
      .findOneByUsername(username.toLowerCase())
      .then((user) => {
        if (user) {
          // Error: User with same username exists
          throw new NotAcceptableException('Username is already in use');
        } else {
          return this.usersService
            .findOneByEmail(email.toLowerCase())
            .then((user) => {
              // Error: User with same username exists
              if (user) {
                throw new NotAcceptableException('Email is already in use');
              } else {
                return this.createUser(username, email, password).then(
                  (user) => user,
                );
              }
            });
        }
      });
  }

  async login(loginUserDTO: LogInDTO): Promise<UserEntity> {
    const { usernameOrEmail, password } = loginUserDTO;
    return this.validateUser(usernameOrEmail, password)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw new UnauthorizedException('Invalid Credentials');
      });
  }

  async sendMail(email: string) {
    await this.mailService.sendVerifyEmail(email);
  }

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserEntity> {
    return this.usersService
      .findByEmailOrUsername(usernameOrEmail)
      .then((user) => {
        if (!user) {
          throw Error;
        } else {
          if (user.gID) return user;
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
