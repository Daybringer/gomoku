import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuickSearchGateway, GameGateway } from './app.gateway';
import { GameService } from './game/game.service';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

require('dotenv').config();

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
    MailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
  ],
  providers: [QuickSearchGateway, GameGateway, GameService],
})
export class AppModule {}
