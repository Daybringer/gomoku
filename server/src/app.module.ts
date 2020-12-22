import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/models/user.entity';
import { RefreshTokenEntity } from './auth/models/refresh-token.entity';
import { NamelessGUserEntity } from './users/models/namelessGUser.entity';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nightrider',
      password: process.env.DATABASE_PASSWORD,
      database: 'gomokuDatabase',
      entities: [UserEntity, RefreshTokenEntity, NamelessGUserEntity],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist/public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
