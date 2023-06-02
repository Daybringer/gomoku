import { GetGameByIDResponseDTO } from 'src/shared/DTO/get-game-by-id.response.dto';
import { GameService } from './services/game.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/:id')
  async fetchGame(@Param('id') id: number): Promise<GetGameByIDResponseDTO> {
    return this.gameService.getGameByID(id);
  }
}
