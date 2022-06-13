import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { NamelessGUserEntity } from '../models/namelessGUser.entity';
import { PlayerGameProfile } from 'src/models/playerGameProfile.entity';
import { UserConfigEntity } from 'src/models/userConfig.entity';
import { GameEntity } from 'src/models/game.entity';
import { TokensService } from 'src/auth/token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PlayerGameProfile,
      UserConfigEntity,
      GameEntity,
    ]),
    TypeOrmModule.forFeature([NamelessGUserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
