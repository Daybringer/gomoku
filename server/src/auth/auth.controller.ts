import {
  Body,
  Controller,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokensService } from './token.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { LogInDTO } from './dto/log-in.dto';
import { UserEntity } from 'src/models/user.entity';

// @Types
import { AuthenticationPayload } from '../shared/types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private tokensService: TokensService,
  ) {}

  // Local
  @Post('register')
  @UsePipes(new ValidationPipe())
  async registerLocal(@Body() signUpDTO: SignUpDTO): Promise<UserEntity> {
    const user = await this.authService.registerLocal(signUpDTO);
    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Post('verify')
  async verify(@Query() params) {
    const verificationCode = params.code;
    const username = params.username;
    return await this.authService.verify(verificationCode, username);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginLocal(@Body() logInDTO: LogInDTO): Promise<AuthenticationPayload> {
    const user = await this.authService.loginLocal(logInDTO);

    const token = await this.tokensService.generateAccessToken(user);

    const { password, ...response } = user;

    const payload = this.buildResponsePayload(response, token); //,refresh

    return payload;
  }

  // TODO implement
  @Post('reset-password')
  async resetPassword() {}

  // Google
  @Post('google')
  async googleAuth(@Body() { id_token }: { id_token: string }) {
    const user = await this.authService.loginGoogle(id_token);
    const token = await this.tokensService.generateAccessToken(user);
    const { password, ...response } = user;

    const payload = this.buildResponsePayload(response, token); //,refresh

    return payload;
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
