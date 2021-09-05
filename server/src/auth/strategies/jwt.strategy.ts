import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/users/models/user.entity';

import { UsersService } from 'src/users/users.service';

export interface AccessTokenPayload {
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '100h',
      },
    });
  }

  async validate(payload: AccessTokenPayload): Promise<UserEntity> {
    const { sub: uuid } = payload;
    const user = await this.usersService.findOneByUUID(uuid);

    if (!user) {
      return null;
    }

    return user;
  }
}
