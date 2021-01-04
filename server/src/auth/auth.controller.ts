'use strict';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserInterface as User } from '../users/models/user.interface';
import { TokensService } from './token.service';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { SignUpDTO } from './dto/sign-up.dto';
import { LogInDTO } from './dto/log-in.dto';
import { GoogleSignInDTO } from './dto/google-sign-in.dto';
import { SetUsernameDTO } from './dto/set-username.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { NamelessGUser } from 'src/users/models/namelessGUser.interface';

interface ResponseObject {
  success: boolean;
  errors: string[];
}

interface AuthResponseObject extends ResponseObject {
  data: AuthenticationPayload | null;
}

interface GenericResponseObject extends ResponseObject {
  data: {} | null;
}

interface AuthenticationPayload {
  user: User;
  payload: {
    type: string;
    token: string;
    refresh_token?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private tokensService: TokensService,
  ) {}

  @Get()
  index() {
    return 'Auth Index';
  }

  @Post('google')
  @UsePipes(new ValidationPipe())
  async signIn(
    @Body() req: GoogleSignInDTO,
  ): Promise<AuthenticationPayload | null> {
    const payload = await this.authService.validateGoogleID(req.id_token);
    if (!payload) throw new UnauthorizedException('Invalid Google User');

    const user = await this.authService.findUserByEmail(payload.email);

    if (!user) {
      const user = await this.authService.namelessGoogleExists(payload.email);
      if (!user) {
        const nameless = await this.authService.createNamelessGoogle(
          payload.email,
          payload.sub,
        );
        return null;
      }
      return null;
    } else {
      if (user.googleID) {
        const token = await this.tokensService.generateAccessToken(user);
        const refresh = await this.tokensService.generateRefreshToken(
          user,
          60 * 60 * 24 * 100,
        );

        const payload = this.buildResponsePayload(user, token, refresh);

        return payload;
      } else {
        throw new UnauthorizedException(
          'This email is linked to standard account.',
        );
      }
    }
  }

  @Post('setGUsername')
  @UsePipes(new ValidationPipe())
  async setUsername(
    @Body() req: SetUsernameDTO,
  ): Promise<AuthenticationPayload> {
    const { username, id_token } = req;

    const payload = await this.authService.validateGoogleID(id_token);
    if (!payload) throw new UnauthorizedException('Invalid Google User');

    const user = await this.authService.setGoogleUsername(
      username,
      payload.email,
    );

    if (!user) throw new UnauthorizedException('Username is already taken');

    const token = await this.tokensService.generateAccessToken(user);
    const refresh = await this.tokensService.generateRefreshToken(
      user,
      60 * 60 * 24 * 100,
    );

    const authPayload = this.buildResponsePayload(user, token, refresh);

    return authPayload;
  }

  /**
   *
   * @param user
   */
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() user: SignUpDTO): Promise<AuthenticationPayload> {
    const result = await this.authService.register(user);
    const token = await this.tokensService.generateAccessToken(result.user);
    const refresh = await this.tokensService.generateRefreshToken(
      result.user,
      60 * 60 * 24 * 100,
    );

    const payload = this.buildResponsePayload(user, token, refresh);

    return payload;
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() user: LogInDTO): Promise<AuthenticationPayload> {
    const validatedUser = await this.authService.login(user);
    const token = await this.tokensService.generateAccessToken(validatedUser);
    const refresh = await this.tokensService.generateRefreshToken(
      validatedUser,
      60 * 60 * 24 * 30,
    );

    const { password, ...response } = validatedUser;

    const payload = this.buildResponsePayload(response, token, refresh);

    return payload;
  }

  // TODO rewrite response
  // TODO Contemplate if I even need refresh tokens
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDTO): Promise<AuthenticationPayload> {
    const {
      user,
      token,
    } = await this.tokensService.createAccessTokenFromRefreshToken(
      body.refreshToken,
    );

    const payload = this.buildResponsePayload(user, token);

    return payload;
  }

  private buildResponsePayload(
    user: User,
    accessToken: string,
    refreshToken?: string,
  ): AuthenticationPayload {
    return {
      user: user,
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      },
    };
  }
}
