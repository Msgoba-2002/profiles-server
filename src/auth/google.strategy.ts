import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../dtos';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const {
      name,
      emails,
    }: {
      name?: { familyName: string; givenName: string };
      emails?: { value: string; verified?: 'true' | 'false' }[];
    } = profile;

    const userFields: CreateUserDto = {
      email: emails[0].value,
      first_name: name.givenName,
      last_name: name.familyName,
      source: 'google',
    };

    let user = await this.userService.getUserByEmail(userFields.email);
    if (!user) {
      user = await this.userService.createUser(userFields);
    }
    return done(null, user);
  }
}
