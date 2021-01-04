import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserInterface as User } from '../../users/models/user.interface';
import { UsersRepositoryService } from 'src/users/usersRepository.service';

export interface AccessTokenPayload {
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly usersRepositoryService: UsersRepositoryService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '100h',
      },
    });
  }

  async validate(payload: AccessTokenPayload): Promise<User> {
    const { sub: uuid } = payload;

    const user = await this.usersRepositoryService.findByUUID(uuid);

    if (!user) {
      return null;
    }

    return user;
  }
}
