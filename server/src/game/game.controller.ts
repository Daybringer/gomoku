import { GetGameByIDResponseDTO } from 'src/shared/DTO/get-game-by-id.response.dto';
import { GameService } from './services/game.service';
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { GetGamesByUserIDDTO } from 'src/shared/DTO/get-games-by-user-id.dto';
import { GetGamesByUserIDResponseDTO } from 'src/shared/DTO/get-games-by-user-id.response.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('/by-user-id')
  async getGameByUsserID(
    @Body() req: GetGamesByUserIDDTO,
  ): Promise<GetGamesByUserIDResponseDTO> {
    return this.gameService.getGamesByUserID(req);
  }

  // @Get('/:id')
  // async fetchGame(@Param('id') id: number): Promise<GetGameByIDResponseDTO> {
  //   return this.gameService.getGameByID(id);
  // }

  @Get('/your-mama')
  yourMama() {
    return 'your mama';
  }
}
