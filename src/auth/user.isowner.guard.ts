import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// This guard expects a userId param in the request
@Injectable()
export class UserIsOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = await context.switchToHttp().getRequest();

    return user.id === params.userId;
  }
}
