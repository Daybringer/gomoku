import {
  Body,
  Controller,
  Get,
  Post,
  Req,
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
import { UsersRepositoryService } from 'src/users/usersRepository.service';
import { JwtAuthGuard } from './guards/jwt.guard';

interface ResponseObject {
  success: boolean;
  data: AuthenticationPayload | null;
  errors: string[];
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
    private usersRepositoryService: UsersRepositoryService,
  ) {}

  @Get()
  index() {
    return 'Auth Index';
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() user: SignUpDTO): Promise<ResponseObject> {
    const result = await this.authService.register(user);

    if (result.errors.length > 0)
      return { success: false, data: null, errors: result.errors };

    const token = await this.tokensService.generateAccessToken(result.user);
    const refresh = await this.tokensService.generateRefreshToken(
      result.user,
      60 * 60 * 24 * 100,
    );

    const payload = this.buildResponsePayload(user, token, refresh);

    return {
      success: true,
      data: payload,
      errors: [],
    };
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() user: LogInDTO): Promise<ResponseObject> {
    const validatedUser = await this.authService.login(user);
    if (!validatedUser)
      return { success: false, data: null, errors: ['Invalid Credentials'] };

    const token = await this.tokensService.generateAccessToken(validatedUser);
    const refresh = await this.tokensService.generateRefreshToken(
      validatedUser,
      60 * 60 * 24 * 30,
    );

    const { password, ...response } = validatedUser;

    const payload = this.buildResponsePayload(response, token, refresh);

    return {
      success: true,
      data: payload,
      errors: [],
    };
  }

  @Post('/refresh')
  async refresh(@Body() body: RefreshTokenDTO): Promise<ResponseObject> {
    const {
      user,
      token,
    } = await this.tokensService.createAccessTokenFromRefreshToken(
      body.refreshToken,
    );

    const payload = this.buildResponsePayload(user, token);

    return {
      success: true,
      data: payload,
      errors: [],
    };
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
