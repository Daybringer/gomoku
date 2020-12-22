import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { UsersRepositoryService } from './usersRepository.service';
import { AuthModule } from 'src/auth/auth.module';
import { NamelessGUserRepositoryService } from './namelessGUserRepository.service';
import { NamelessGUserEntity } from './models/namelessGUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([NamelessGUserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepositoryService,
    NamelessGUserRepositoryService,
  ],
  exports: [UsersRepositoryService, NamelessGUserRepositoryService],
})
export class UsersModule {}
