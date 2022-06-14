import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokensService } from './token.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { LogInDTO } from './dto/log-in.dto';
import { UserEntity } from 'src/models/user.entity';
import { AuthGuard } from '@nestjs/passport';

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

  // Local
  @Post('register')
  @UsePipes(new ValidationPipe())
  async registerLocal(@Body() signUpDTO: SignUpDTO): Promise<UserEntity> {
    const user = await this.authService.registerLocal(signUpDTO);

    return user;
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

  // Google
  // FIXME zero idea what this code does now :/
  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {}

  // @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Req() req) {
  //   if (!req.user) {
  //     throw new UnauthorizedException("Google user doesn't exist");
  //   }
  //   return req.user;
  // }

  // Facebook
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {}

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req) {
    return req.user;
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
