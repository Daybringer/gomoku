import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {
  QuickSearchGateway,
  CreateCustomGateway,
  CustomWaitingGateway,
  GameGateway,
  GeneralGateway,
  RankedSearchGateway,
} from './app.gateway';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';

require('dotenv').config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    GameModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
  ],
  providers: [
    GeneralGateway,
    QuickSearchGateway,
    RankedSearchGateway,
    GameGateway,
    CreateCustomGateway,
    CustomWaitingGateway,
  ],
})
export class AppModule {}
