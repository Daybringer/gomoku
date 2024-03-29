import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokensService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '100d' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UsersModule),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, JwtStrategy, AuthService, TokensService],
  exports: [AuthService, TokensService],
})
export class AuthModule {}
