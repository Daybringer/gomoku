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
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { UserEntity } from './models/user.entity';
// DTOs
import { CheckUsernameDTO } from './dto/check-username.dto';
import { CheckEmailDTO } from './dto/check-email.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async returnAllUser() {
    return this.usersService.findAll();
  }

  @Post('/check-username')
  @UsePipes(new ValidationPipe())
  async checkUsername(@Body() req: CheckUsernameDTO): Promise<boolean> {
    const user = await this.usersService.findOneByUsername(req.username);
    return !!user;
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
  @Post('me')
  async fetchUser(@Req() req): Promise<UserEntity> {
    console.log('API HIT');
    // const userUUID = req.user.uuid;

    // const user = await this.usersService.findByUUID(userUUID);
    return req.user;
  }
}
