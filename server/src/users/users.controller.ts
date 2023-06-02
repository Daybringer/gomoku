import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
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
import { User } from 'src/shared/interfaces/user.interface';
import { BuyIconDTO } from 'src/shared/DTO/buy-icon.dto';
import { SelectIconDTO } from 'src/shared/DTO/select-icon.dto';
import { SetGameboardDTO } from 'src/shared/DTO/set-gameboard.dto';
import { SetColorsDTO } from 'src/shared/DTO/set-colors.dto';
import { ExpandedGame } from 'src/shared/interfaces/game.interface';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/check-username')
  @UsePipes(new ValidationPipe())
  async checkUsername(@Body() req: CheckUsernameDTO): Promise<boolean> {
    const user = await this.usersService.findOneByUsername(req.username);
    return !!user;
  }


  @Get('/profile/:id')
  async fetchUser(@Param('id') id: number): Promise<User> {

    const { password, mailVerificationCode, socialID, ...user } = await this.usersService.findOneByID(id);
    return user;
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
    const verifiedUser: UserEntity = req.user;
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      throw new UnauthorizedException(
        'User with given username already exists',
      );
    } else if (verifiedUser.nameChangeTokens <= 0) {
      throw new UnauthorizedException('Not enough name change tokens');
    } else {
      const updatedUser = await this.usersService.decrementNameTokens(
        verifiedUser,
      );
      return await this.usersService.updateUsername(updatedUser, username);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async fetchSelfUser(@Req() req): Promise<User> {
    const { password, ...rest } = req.user;
    return rest;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('buy-icon')
  async buyIcon(@Req() req, @Body() buyIconDTO: BuyIconDTO) {
    const user: UserEntity = req.user;
    return this.usersService.buyIcon(user, buyIconDTO.icon);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('select-icon')
  async selectIcon(@Req() req, @Body() selectIconDTO: SelectIconDTO) {
    const user: UserEntity = req.user;
    return this.usersService.selectIcon(user, selectIconDTO.icon);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('set-gameboard')
  async setGameboard(@Req() req, @Body() setGameboardDTO: SetGameboardDTO) {
    const user: UserEntity = req.user;
    return this.usersService.setGameboard(user, setGameboardDTO.gameboard);
  }

  @UseGuards(JwtAuthGuard)
  @Post('set-colors')
  async setColors(@Req() req, @Body() setColorsDTO: SetColorsDTO) {
    const user: UserEntity = req.user;
    return this.usersService.setColors(
      user,
      setColorsDTO.myColor,
      setColorsDTO.enemyColor,
    );
  }

  @Get('leaderboard-position/:userID')
  async getUsersLeaderboardPosition(
    @Param('userID') userID: string,
  ): Promise<number> {
    const user = await this.usersService.findOneByID(Number(userID));
    if (!user) throw new BadRequestException('User not found');
    return this.usersService.getLeaderboardPosition(user);
  }
}
