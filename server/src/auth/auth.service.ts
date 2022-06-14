import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';

import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

import { UsersService } from 'src/users/users.service';
import { LoginStrategy, UserEntity } from 'src/models/user.entity';
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
    private readonly configService: ConfigService,
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

    return await this.usersService
      .findOneByUsername(username)
      .then(async (user) => {
        // User Exists
        if (user) {
          // Error: User exists and is verified
          if (user.verified) {
            throw new NotAcceptableException('Username is already in use');
          } else {
            if (this.usersService.isVerificationTimedOut(user)) {
              await this.usersService.removeOneByID(user.id);
              return await this.registerLocal(signUpDTO);
            } else {
              // Error: User exists and is not verified, but still has time to do so
              throw new NotAcceptableException('Username is already in use');
            }
          }
        } else {
          return await this.usersService
            .findOneByEmail(email.toLowerCase())
            .then(async (user) => {
              // Error: User with same email exists

              if (user) {
                if (user.verified) {
                  throw new NotAcceptableException('Email is already in use');
                } else {
                  if (this.usersService.isVerificationTimedOut(user)) {
                    await this.usersService.removeOneByID(user.id);
                    return await this.registerLocal(signUpDTO);
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
                // verification token is generated while creating user with createLocal method
                // might be better to generate here and then save it to according user?
                // const verificationToken =
                //   await this.tokenService.generateVerificationToken(newUser);

                this.mailService.sendVerificationEmail(
                  newUser.email,
                  newUser.username,
                  newUser.mailVerificationCode,
                );

                return newUser;
              }
            });
        }
      });
  }

  /**
   * Verifies account from sent email verification code
   * @param code
   * @param username
   * @returns
   */
  async verify(code: string, username: string) {
    let user: UserEntity;
    user = await this.usersService.findOneByUsername(username);

    if (!user)
      throw new NotAcceptableException("User with given username doesn'exist");
    if (user.mailVerificationCode !== code)
      throw new NotAcceptableException('Incorrect verification code.');
    if (user.verified)
      throw new NotAcceptableException('User is already verified.');

    if (this.usersService.isVerificationTimedOut(user)) {
      await this.usersService.removeOneByID(user.id);
      throw new NotAcceptableException('Time for verification has run out.');
    } else {
      await this.usersService.verifyUser(user);
      return 'Account has been successfully verified.';
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

  async loginGoogle(id_token: string): Promise<UserEntity> {
    const client = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
    try {
      const ticket = await client.verifyIdToken({ idToken: id_token });
      const payload = ticket.getPayload();
      const userID = ticket.getUserId();
      const email = payload.email;

      // checking if user with given mail exists
      const user = await this.usersService.findOneByEmail(email);

      // user exists FLOW
      if (user) {
        if (user.strategy == LoginStrategy.GOOGLE) {
          // Login
          return user;
        } else {
          // Throw unauthorized error
          throw new UnauthorizedException(
            'Account with same email adress is already registered and requires password to log in',
          );
        }
      } else {
        // user DOESN'T exist FLOW
        return this.registerGoogle(email, userID);
      }
    } catch (error) {
      throw error;
    }
    return;
  }

  async registerGoogle(email: string, userID: string): Promise<UserEntity> {
    return;
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
          if (user.strategy !== LoginStrategy.LOCAL)
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
