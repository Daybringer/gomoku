import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { UserEntity } from 'src/users/models/user.entity';

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://gomoku.vanata.dev',
  audience: 'https://gomoku.vanata.dev',
};

@Injectable()
export class TokensService {
  public constructor(private readonly jwtService: JwtService) {}

  public async generateAccessToken(user: UserEntity): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.UUID),
    };

    return this.jwtService.signAsync({}, opts);
  }
}
