import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../user/userTypes';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
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

  async sendVerificationEmail(user: IUser) {

  }

  async verifyEmail(token: string) {
    
  }
}
