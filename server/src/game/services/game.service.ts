import { GetGameByUserIDDTOResponse } from 'src/shared/DTO/get-game-by-user-id.response.dto';
import { GetGamesByUserIDDTO } from 'src/shared/DTO/get-game-by-user-id.dto';
import { GetGameByIDResponseDTO } from 'src/shared/DTO/get-game-by-id.response.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EndingType, Player, GameType } from 'gomoku-shared-types/';
import { GameEntity } from 'src/models/game.entity';
import { PlayerGameProfileEntity } from 'src/models/playerGameProfile.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AnyGame } from '../game.class';
import { PlayerGameProfile } from 'src/shared/interfaces/playerGameProfile.interface';
import { Game } from 'src/shared/interfaces/game.interface';
import createRatingSystem from './rating';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(PlayerGameProfileEntity)
    private readonly playerGameProfileRepository: Repository<PlayerGameProfile>,
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

    gameEntity.gameSettings.openingType = game.opening;
    gameEntity.gameSettings.hasTimeLimit = game.hasTimeLimit;
    gameEntity.gameSettings.doesOverlineCount = true;
    gameEntity.gameSettings.boardSize = 15;
    gameEntity.gameSettings.winningLineSize = 5;
    gameEntity.gameSettings.timeLimitInSeconds = game.timeLimitInSeconds;

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
  // async getGameByID(gameID: number): Promise<GetGameByIDResponseDTO> {
  //   const game = await this.gameRepository.findOne({ where: { id: gameID } });
  //   if (!game) throw new BadRequestException("Game doesn't exist");
  //   const playerGameProfiles = await this.playerGameProfileRepository.findByIds(
  //     game.playerGameProfileIDs,
  //   );
  //   if (playerGameProfiles.length !== 2)
  //     throw new BadRequestException(
  //       'Game profiles are corrupted (missing/overflowing)',
  //     );

  //   return { game: await this.expandGame(game, playerGameProfiles) };
  // }

  // async getGamesByUserID(
  //   dto: GetGamesByUserIDDTO,
  // ): Promise<GetGameByUserIDDTOResponse> {
  //   const constraints = dto.constraints;

  //   // TODO fix this with relations
  //   const gameProfiles = await this.playerGameProfileRepository.find({
  //     where: { userID: dto.userID },
  //     order: { id: 'DESC' },
  //     skip: dto.skip,
  //     take: dto.take,
  //   });

  //   const gameIDs = gameProfiles.map((gameProfile) => gameProfile.gameID);

  //   const expandedGames: ExpandedGame[] = [];

  //   for await (const gameID of gameIDs) {
  //     expandedGames.push((await this.getGameByID(gameID)).game);
  //   }

  //   return { games: expandedGames };
  // }
}
