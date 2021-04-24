import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { NamelessGUserEntity } from './models/namelessGUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([NamelessGUserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
