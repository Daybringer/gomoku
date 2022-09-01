import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {
  QuickSearchGateway,
  GameGateway,
  CreateCustomGateway,
  CustomWaitingGateway,
} from './app.gateway';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';

require('dotenv').config();
// Just squezing some comment for prod
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
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
    QuickSearchGateway,
    GameGateway,
    CreateCustomGateway,
    CustomWaitingGateway,
  ],
})
export class AppModule {}
