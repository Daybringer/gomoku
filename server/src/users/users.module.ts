import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PlayerGameProfileEntity } from 'src/models/playerGameProfile.entity';
import { GameEntity } from 'src/models/game.entity';
import { UserSettingsEntity } from 'src/models/userSettings.entity';
import { UserStatisticsEntity } from 'src/models/userStatistics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PlayerGameProfileEntity,
      GameEntity,
      UserSettingsEntity,
      UserStatisticsEntity,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
