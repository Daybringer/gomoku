import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PlayerGameProfile } from 'src/models/playerGameProfile.entity';
import { GameEntity } from 'src/models/game.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PlayerGameProfile, GameEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
