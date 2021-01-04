import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/auth/models/refresh-token.entity';
import { UserEntity } from 'src/users/models/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokensService } from './token.service';
require('dotenv').config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '100h' },
    }),
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    JwtAuthGuard,
    JwtStrategy,
    AuthService,
    TokensService,
    // GoogleStrategy,
  ],
  exports: [JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
