import { ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { USER_POSITIONS } from '../constants/user.constants';
import { AuthenticatedGuard } from './authenticated.guard';

@Injectable()
export class UserIsExcoGuard extends AuthenticatedGuard {
  constructor(private readonly userService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }
    const { user } = await context.switchToHttp().getRequest();

    const userPosition = await this.userService.getUserPosition(user.id);
    return (
      userPosition === USER_POSITIONS.EXCO ||
      userPosition === USER_POSITIONS.ADMIN
    );
  }
}
