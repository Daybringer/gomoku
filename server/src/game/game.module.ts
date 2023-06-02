import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/models/game.entity';
import { PlayerGameProfile } from 'src/models/playerGameProfile.entity';
import { UsersModule } from 'src/users/users.module';
import { GameController } from './game.controller';
import { CustomRoomService } from './services/customRoom.service';
import { GameService } from './services/game.service';
import { SearchService } from './services/search.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, PlayerGameProfile]),
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
  providers: [GameService, SearchService, CustomRoomService],
  exports: [GameService, SearchService, CustomRoomService],
})
export class GameModule {}
