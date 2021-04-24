import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokensService } from './token.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { LogInDTO } from './dto/log-in.dto';
import { UserEntity } from 'src/users/models/user.entity';

interface AuthenticationPayload {
  user: UserEntity;
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

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() signUpDTO: SignUpDTO): Promise<AuthenticationPayload> {
    const user = await this.authService.register(signUpDTO);

    const token = await this.tokensService.generateAccessToken(user);

    const payload = this.buildResponsePayload(user, token); //,refresh

    return payload;
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() logInDTO: LogInDTO): Promise<AuthenticationPayload> {
    const user = await this.authService.login(logInDTO);
    const token = await this.tokensService.generateAccessToken(user);

    const { password, ...response } = user;

    const payload = this.buildResponsePayload(response, token); //,refresh

    return payload;
  }

  @Post('mail')
  mail(@Body() body: { email: string }) {
    this.authService.sendMail(body.email);
  }

  private buildResponsePayload(
    user: UserEntity,
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
