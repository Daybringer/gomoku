import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: 'testID', //configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: 'testSecret', // configService.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? 'https://gomoku.vanata.dev/api/auth/facebook/redirect'
          : 'http://localhost:3000/api/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    done(null, user);
  }
}
