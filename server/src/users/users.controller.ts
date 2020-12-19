import { Controller, Get } from '@nestjs/common';
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
}
