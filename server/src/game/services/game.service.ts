import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EndingType, Player, GameType } from '../../shared/types';
import { GameEntity } from 'src/models/game.entity';
import { PlayerGameProfileEntity } from 'src/models/playerGameProfile.entity';
import { UsersService } from 'src/users/users.service';
import { Repository, createQueryBuilder } from 'typeorm';
import { AnyGame } from '../game.class';
import { PlayerGameProfile } from 'src/shared/interfaces/playerGameProfile.interface';
import { Game } from 'src/shared/interfaces/game.interface';
import createRatingSystem from './rating';
import { GameSettingsEntity } from 'src/models/gameSettings.entity';
import { GameSettings } from 'src/shared/interfaces/gameSettings.interface';
import { GetGamesByUserIDDTO } from 'src/shared/DTO/get-game-by-user-id.dto';
import { GetGameByUserIDDTOResponse } from 'src/shared/DTO/get-game-by-user-id.response.dto';
import { use } from 'passport';
import { GetGameByIDResponseDTO } from 'src/shared/DTO/get-game-by-id.response.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(PlayerGameProfileEntity)
    private readonly playerGameProfileRepository: Repository<PlayerGameProfile>,
    @InjectRepository(GameSettingsEntity)
    private readonly gameSettingsRepository: Repository<GameSettings>,
    private readonly usersService: UsersService,
  ) {}

  async savePlayerGameProfile(
    player: Player,
    eloDiff?: number,
  ): Promise<PlayerGameProfile> {
    const playerGameProfileEntity = this.playerGameProfileRepository.create();

    if (player.userID) {
      const user = await this.usersService.findOneByID(player.userID);
      playerGameProfileEntity.user = user;
    }

    if (eloDiff) {
      playerGameProfileEntity.eloDelta = eloDiff;
    }

    playerGameProfileEntity.timeLeft = player.timeLeft;

    return await this.playerGameProfileRepository.save(playerGameProfileEntity);
  }

  async saveGame(game: AnyGame): Promise<Game> {
    const gameEntity: GameEntity = this.gameRepository.create();
    // Profiles
    const socketIDtoPlayerGameProfile: {
      [socketID: string]: PlayerGameProfile;
    } = {};

    const [playerOne, playerTwo] = game.players;
    let playerOneProfile: PlayerGameProfile,
      playerTwoProfile: PlayerGameProfile;
    if (game.gameType === GameType.Ranked) {
      // Caculating elo deltas for each player
      if (!playerOne.userID || !playerTwo.userID)
        throw new InternalServerErrorException(
          'UserID missing on player when expected',
        );
      const elos = await this.calcElo(
        playerOne.userID,
        playerTwo.userID,
        game.gameEnding === EndingType.Tie,
        game.winner ? game.winner.userID : 0,
      );

      playerOneProfile = await this.savePlayerGameProfile(
        playerOne,
        elos[playerOne.userID],
      );
      await this.usersService.updateElo(
        playerOne.userID,
        elos[playerOne.userID],
      );

      playerTwoProfile = await this.savePlayerGameProfile(
        playerTwo,
        elos[playerTwo.userID],
      );
      await this.usersService.updateElo(
        playerTwo.userID,
        elos[playerTwo.userID],
      );
    } else {
      playerOneProfile = await this.savePlayerGameProfile(playerOne);
      playerTwoProfile = await this.savePlayerGameProfile(playerTwo);
    }

    socketIDtoPlayerGameProfile[playerOne.socketID] = playerOneProfile;
    socketIDtoPlayerGameProfile[playerTwo.socketID] = playerTwoProfile;

    gameEntity.type = game.gameType;
    gameEntity.turnHistory = game.turns;
    gameEntity.typeOfWin = game.gameEnding;

    if (game.gameEnding === EndingType.Combination)
      gameEntity.winningCombination = game.gameboard.getWinningCombination();

    const settings = this.gameSettingsRepository.create();
    settings.openingType = game.opening;
    settings.hasTimeLimit = game.hasTimeLimit;
    settings.doesOverlineCount = true;
    settings.boardSize = 15;
    settings.winningLineSize = 5;
    settings.timeLimitInSeconds = game.timeLimitInSeconds;
    gameEntity.gameSettings = await this.gameSettingsRepository.save(settings);

    if (game.gameEnding !== EndingType.Tie)
      gameEntity.winner = socketIDtoPlayerGameProfile[game.winner.socketID];

    gameEntity.playerGameProfiles = [playerOneProfile, playerTwoProfile];

    [playerOneProfile, playerTwoProfile].forEach(async (profile) => {
      // if a player is logged in, update their game stats and update achievements
      if (profile.user) {
        this.usersService.checkAchievements(profile.user, game);
        this.usersService.addNewGameToStats(
          profile.user,
          game.gameType,
          game.gameEnding === EndingType.Tie,
          profile.id === socketIDtoPlayerGameProfile[game.winner.socketID].id,
        );
      }
    });

    const savedGameEntity = await this.gameRepository.save(gameEntity);

    return savedGameEntity;
  }
  /**
   * @returns -{userID:eloDiff} object
   */
  private async calcElo(
    playerAUserID: number,
    playerBUserID: number,
    isTie: boolean,
    winnerUserID?: number,
  ): Promise<Record<number, number>> {
    const playerAElo = (await this.usersService.findOneByID(playerAUserID)).elo;
    const playerBElo = (await this.usersService.findOneByID(playerBUserID)).elo;

    const ratingSystem = createRatingSystem(20, 600);
    const APlayerScore = isTie ? 0.5 : winnerUserID == playerAUserID ? 2 : 0;
    const { playerARatingDiff, playerBRatingDiff } =
      ratingSystem.getNextRatings(playerAElo, playerBElo, APlayerScore);

    const result = {};
    result[playerAUserID] = playerARatingDiff;
    result[playerBUserID] = playerBRatingDiff;

    return result;
  }

  async getGameByID(gameID: number): Promise<GetGameByIDResponseDTO> {
    const game = await this.gameRepository.findOne({
      relations: ['playerGameProfiles'],
      where: { id: gameID },
    });
    if (!game) throw new BadRequestException("Game doesn't exist");
    const fProfile = await this.playerGameProfileRepository.findOne({
      relations: ['user'],
      where: { id: game.playerGameProfiles[0].id },
    });
    const sProfile = await this.playerGameProfileRepository.findOne({
      relations: ['user'],
      where: { id: game.playerGameProfiles[1].id },
    });
    game.playerGameProfiles[0] = fProfile;
    game.playerGameProfiles[1] = sProfile;

    return { game };
  }

  async getGamesByUserID(
    dto: GetGamesByUserIDDTO,
  ): Promise<GetGameByUserIDDTOResponse> {
    const constraints = dto.constraints;

    // BUG Getting Table name specified more then once error when doing it pretty way
    // related SO question https://stackoverflow.com/questions/64138710/typeorm-table-name-specified-more-than-once
    const games = (
      await this.playerGameProfileRepository.find({
        relations: ['game', 'user'],
        where: {
          user: {
            id: dto.userID,
          },
        },
        order: { id: 'DESC' },
        skip: dto.skip,
        take: dto.take,
      })
    ).map((profile) => profile.game);

    const gamesWithUsers = (
      await Promise.all(games.map((game) => this.getGameByID(game.id)))
    ).map((dto) => dto.game);

    return { games: gamesWithUsers };
  }
}
