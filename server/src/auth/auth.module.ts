import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/auth/models/refresh-token.entity';
import { UserEntity } from 'src/users/models/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { TokensService } from './token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService, GoogleStrategy],
})
export class AuthModule {}
