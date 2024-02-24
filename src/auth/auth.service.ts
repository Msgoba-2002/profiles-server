import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { IUserWithoutPass } from '../user/userTypes';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../types/events.types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email, true);
    if (!user) return null;

    const pwIsValid = await bcrypt.compare(password, user.password);
    if (user && pwIsValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async sendVerificationEmail(user: IUserWithoutPass) {
    const token = await this.jwtService.signAsync({ email: user.email });

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(
        user,
        token,
        this.configService.get('APP_FRONTEND_URL'),
      ),
    );
  }

  getJwtSecret() {
    return this.configService.get('JWT_SECRET');
  }
  // async verifyEmail(token: string) {

  // }
}
