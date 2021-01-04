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
import { UsersRepositoryService } from './usersRepository.service';
// DTOs
import { CheckUsernameDTO } from './dto/check-username.dto';
import { CheckEmailDTO } from './dto/check-email.dto';
import { UserInterface } from './models/user.interface';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersRepositoryService: UsersRepositoryService,
  ) {}

  @Get()
  async returnAllUser() {
    return this.usersRepositoryService.findAll();
  }

  @Post('/check-username')
  @UsePipes(new ValidationPipe())
  async checkUsername(@Body() req: CheckUsernameDTO): Promise<boolean> {
    const user = await this.usersRepositoryService.findOneByUsername(
      req.username,
    );
    return !!user;
  }

  @Post('/check-email')
  @UsePipes(new ValidationPipe())
  async checkEmail(@Body() req: CheckEmailDTO): Promise<boolean> {
    const user = await this.usersRepositoryService.findOneByEmail(
      req.email.toLowerCase(),
    );
    return !!user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async fetchUser(@Req() req): Promise<UserInterface> {
    const userUUID = req.user.uuid;

    const user = await this.usersRepositoryService.findByUUID(userUUID);
    return user;
  }
}
