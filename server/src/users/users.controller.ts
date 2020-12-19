import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersRepositoryService } from './usersRepository.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersRepositoryService: UsersRepositoryService,
  ) {}

  @Get()
  async returnAllUser() {
    return this.usersRepositoryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async fetchUser(@Req() req) {
    const userUUID = req.user.uuid;

    const user = await this.usersRepositoryService.findByUUID(userUUID);

    return {
      success: true,
      data: user,
    };
  }
}
