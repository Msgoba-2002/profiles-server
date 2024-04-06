import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { IUserWithoutPass } from '../user/userTypes';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PasswordResetEvent,
  PasswordResetRequestEvent,
  UserRegisteredEvent,
} from '../types/events.types';
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

  async verifyEmail(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const user = await this.userService.getUserByEmail(decoded.email, false);

      if (user) {
        await this.userService.updateUser({
          data: { email_verified: true },
          user_id: user.id,
        });
      }
    } catch (err) {
      console.error(err);
      throw new Error('Error verifying email, please request another link');
    }
  }

  async sendForgotPasswordEmail(user: IUserWithoutPass) {
    const token = await this.jwtService.signAsync({ email: user.email });

    await this.userService.updateUser({
      data: { pw_reset_token: token },
      user_id: user.id,
    });

    this.eventEmitter.emit(
      'user.reqPwReset',
      new PasswordResetRequestEvent(
        user,
        token,
        this.configService.get('APP_FRONTEND_URL'),
      ),
    );
  }

  async updatePassword(token: string, password: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const user = await this.userService.getUserByEmail(
        decoded.email,
        false,
        true,
      );

      if (user) {
        if (user.pw_reset_token !== token) {
          throw new Error('Invalid token');
        }
        const hashedPw = await bcrypt.hash(password, 12);
        await this.userService.updateUser({
          data: { password: hashedPw, pw_reset_token: null },
          user_id: user.id,
        });

        this.eventEmitter.emit('user.pwReset', new PasswordResetEvent(user));
      }
    } catch (err) {
      console.error(err);
      throw new Error('Error updating password, please request another link');
    }
  }
}
