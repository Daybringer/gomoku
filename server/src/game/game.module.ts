import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/models/game.entity';
import { PlayerGameProfile } from 'src/models/playerGameProfile.entity';
import { UsersModule } from 'src/users/users.module';
import { GameController } from './game.controller';
import { CustomRoomService } from './services/customRoom.service';
import { GameService } from './services/game.service';
import { SearchService } from './services/search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, PlayerGameProfile]),
    UsersModule,
  ],
  controllers: [GameController],
  providers: [GameService, SearchService, CustomRoomService],
  exports: [GameService, SearchService, CustomRoomService],
})
export class GameModule {}
