import { UnprocessableEntityException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';

import { RefreshTokenEntity } from './models/refresh-token.entity';
import { RefreshTokenInterface as RefreshToken } from './models/refresh-token.interface';
import { UserInterface as User } from 'src/users/models/user.interface';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://playgomoku.com',
  audience: 'https://playgomoku.com',
};

export interface RefreshTokenPayload {
  // Token ID
  jti: number;
  // User's UUID
  sub: string;
}

@Injectable()
export class TokensService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // ? Creating refresh token for 100 days
  public async createRefreshToken(
    user: User,
    ttl: number = 60 * 60 * 24 * 100,
  ): Promise<RefreshToken> {
    const token = new RefreshTokenEntity();

    token.userUUID = user.UUID;
    token.isRevoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);

    token.expires = expiration;

    return this.refreshTokenRepository.save(token);
  }

  public async findTokenByID(id: number): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      id,
    });
  }

  public async generateAccessToken(user: User): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.UUID),
    };

    return this.jwtService.signAsync({}, opts);
  }

  public async generateRefreshToken(
    user: User,
    expiresIn: number,
  ): Promise<string> {
    const token = await this.createRefreshToken(user, expiresIn);

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(user.UUID),
      jwtid: String(token.id),
    };

    return this.jwtService.signAsync({}, opts);
  }

  public async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: User; token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return { user, token };
  }

  public async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: User }> {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<User> {
    const subId = payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.userRepository.findOne({ UUID: subId });
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | null> {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.refreshTokenRepository.findOne({ id: tokenId });
  }
}
