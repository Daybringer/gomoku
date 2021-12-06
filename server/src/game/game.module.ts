import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './services/game.service';
import { SearchService } from './services/search.service';

@Module({
  controllers: [GameController],
  providers: [GameService, SearchService]
})
export class GameModule {}
