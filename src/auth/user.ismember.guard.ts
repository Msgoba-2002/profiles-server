import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedGuard } from './authenticated.guard';

@Injectable()
export class UserIsExcoGuard extends AuthenticatedGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }
    const { user } = await context.switchToHttp().getRequest();

    return user.questions_verified;
  }
}
