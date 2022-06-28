import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { UserEntity } from '../models/user.entity';
// DTOs
import { CheckUsernameDTO } from './dto/check-username.dto';
import { CheckEmailDTO } from './dto/check-email.dto';
import { PasswordChangeDTO } from './dto/password-change.dto';
import { UsernameChangeDTO } from './dto/username-change.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/check-username')
  @UsePipes(new ValidationPipe())
  async checkUsername(@Body() req: CheckUsernameDTO): Promise<boolean> {
    const user = await this.usersService.findOneByUsername(req.username);
    return !!user;
  }

  @Post('/generate-name')
  generateName(): string {
    return this.usersService.generateRandomName();
  }

  @Post('/check-email')
  @UsePipes(new ValidationPipe())
  async checkEmail(@Body() req: CheckEmailDTO): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(
      req.email.toLowerCase(),
    );
    return !!user;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('change-password')
  async changePassword(
    @Req() req,
    @Body() passwordChangeDTO: PasswordChangeDTO,
  ) {
    return this.usersService.updatePassword(
      req.user,
      passwordChangeDTO.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('change-username')
  async changeUsername(
    @Req() req,
    @Body() usernameChangeDTO: UsernameChangeDTO,
  ) {
    const { username } = usernameChangeDTO;
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      return new UnauthorizedException(
        'User with given username already exists',
      );
    } else {
      await this.usersService.decrementNameTokens(user);
      return await this.usersService.updateUsername(user, username);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async fetchUser(@Req() req): Promise<UserEntity> {
    const { password, ...rest } = req.user;
    return rest;
  }
}
