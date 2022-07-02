import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/models/game.entity';
import { PlayerGameProfile } from 'src/models/playerGameProfile.entity';
import { GameController } from './game.controller';
import { GameService } from './services/game.service';
import { SearchService } from './services/search.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity, PlayerGameProfile])],
  controllers: [GameController],
  providers: [GameService, SearchService],
  exports: [GameService, SearchService],
})
export class GameModule {}
