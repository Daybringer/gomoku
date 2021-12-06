import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuickSearchGateway, GameGateway } from './app.gateway';
import { GameService } from './game/services/game.service';
import { ConfigModule } from '@nestjs/config';
import { SearchService } from './game/services/search.service';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
  ],
  providers: [QuickSearchGateway, GameGateway, GameService, SearchService],
})
export class AppModule {}
