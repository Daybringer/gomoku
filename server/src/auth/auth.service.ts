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

import { hash, compare } from 'bcrypt';
import { TokensService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly tokenService: TokensService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return hash(password, 13);
  }

  async comparePassword(
    newPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return compare(newPassword, passwordHash);
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

  async registerLocal(signUpDTO: SignUpDTO): Promise<UserEntity> {
    const { username, email, password } = signUpDTO;

    return this.usersService.findOneByUsername(username).then(async (user) => {
      if (user) {
        // Error: User with same username exists
        if (user.verified) {
          throw new NotAcceptableException('Username is already in use');
        } else {
          if (this.usersService.isVerificationTimedOut(user)) {
            await this.usersService.removeOneByUUID(user.UUID);
            return this.registerLocal(signUpDTO);
          } else {
            throw new NotAcceptableException('Username is already in use');
          }
        }
      } else {
        return this.usersService
          .findOneByEmail(email.toLowerCase())
          .then(async (user) => {
            // Error: User with same email exists

            if (user) {
              if (user.verified) {
                throw new NotAcceptableException('Email is already in use');
              } else {
                if (this.usersService.isVerificationTimedOut(user)) {
                  await this.usersService.removeOneByUUID(user.UUID);
                  return this.registerLocal(signUpDTO);
                } else {
                  throw new NotAcceptableException('Email is already in use');
                }
              }
            } else {
              const newUser = await this.createUser(
                username,
                email.toLowerCase(),
                password,
              );
              // send verification mail
              const verificationToken = await this.tokenService.generateVerificationToken(
                newUser,
              );
              this.mailService.sendVerificationEmail(
                newUser.email,
                verificationToken,
              );

              return newUser;
            }
          });
      }
    });
  }

  async verify(token: string) {
    let user: UserEntity;
    try {
      const userUUID = await this.tokenService.decodeVerificationToken(token);
      user = await this.usersService.findOneByUUID(userUUID);
    } catch (error) {
      console.log(error);
      throw new NotAcceptableException('Incorrect verification code.');
    }

    if (user) {
      if (!user.verified) {
        if (this.usersService.isVerificationTimedOut(user)) {
          await this.usersService.removeOneByUUID(user.UUID);
          throw new NotAcceptableException(
            'Time for verification has run out.',
          );
        } else {
          await this.usersService.verifyUser(user);
          return 'Account has been successfully verified.';
        }
      } else {
        throw new NotAcceptableException('User is already verified');
      }
    } else {
      throw new NotAcceptableException('Incorrect verification code.');
    }
  }

  async loginLocal(loginUserDTO: LogInDTO): Promise<UserEntity> {
    const { usernameOrEmail, password } = loginUserDTO;
    return this.validateUser(usernameOrEmail, password)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw new UnauthorizedException('Invalid Credentials');
      });
  }

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserEntity> {
    return this.usersService
      .findByEmailOrUsername(usernameOrEmail)
      .then((user) => {
        if (!user) {
          throw new NotAcceptableException('Incorrect credentials');
        } else {
          if (user.strategy !== 'local')
            throw new NotAcceptableException(
              'Email is associated with different login strategy',
            );

          if (user.verified !== true)
            throw new NotAcceptableException('Account is not verified');

          return this.comparePassword(password, user.password).then(
            (passwordsMatch) => {
              if (passwordsMatch) {
                const { password, ...response } = user;
                return response;
              } else {
                throw new NotAcceptableException('Incorrect credentials');
              }
            },
          );
        }
      });
  }
}
