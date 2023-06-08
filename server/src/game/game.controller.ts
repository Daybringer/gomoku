import { GameService } from './services/game.service';
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { GetGamesByUserIDDTO } from '../shared/DTO/get-game-by-user-id.dto';
import { GetGameByUserIDDTOResponse } from 'src/shared/DTO/get-game-by-user-id.response.dto';
import { GetGameByIDResponseDTO } from 'src/shared/DTO/get-game-by-id.response.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('/by-user-id')
  async getGameByUsserID(
    @Body() req: GetGamesByUserIDDTO,
  ): Promise<GetGameByUserIDDTOResponse> {
    console.log('HIT', req);
    return this.gameService.getGamesByUserID(req);
  }

  @Get('/:id')
  async fetchGame(@Param('id') id: number): Promise<GetGameByIDResponseDTO> {
    return this.gameService.getGameByID(id);
  }
}
