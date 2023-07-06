import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/models/game.entity';
import { PlayerGameProfileEntity } from 'src/models/playerGameProfile.entity';
import { UsersModule } from 'src/users/users.module';
import { GameController } from './game.controller';
import { CustomRoomService } from './services/customRoom.service';
import { GameService } from './services/game.service';
import { SearchService } from './services/search.service';
import { GameRoomService } from './services/gameRoom.service';
import { GameSettingsEntity } from 'src/models/gameSettings.entity';
import { UserSettingsEntity } from 'src/models/userSettings.entity';
import { UserStatisticsEntity } from 'src/models/userStatistics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameEntity,
      PlayerGameProfileEntity,
      GameSettingsEntity,
      UserSettingsEntity,
      UserStatisticsEntity,
    ]),
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '100h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [GameController],
  providers: [GameService, SearchService, CustomRoomService, GameRoomService],
  exports: [GameService, SearchService, CustomRoomService, GameRoomService],
})
export class GameModule {}
