import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { UserEntity } from 'src/models/user.entity';

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://gomoku.vanata.dev',
  audience: 'https://gomoku.vanata.dev',
};

@Injectable()
export class TokensService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(user: UserEntity): Promise<string> {
    const opts: JwtSignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
    };

    return this.jwtService.signAsync({}, opts);
  }

  /**
   * Pseudorandom token generation
   * @param length can be max 34 characters long
   * @returns
   */
  generateRandomToken(length: number, uppercase: boolean): string {
    let token = Math.random()
      .toString(36)
      .slice(2, length + 2);

    if (uppercase) {
      token = token.toUpperCase();
    }

    return token;
  }
}
