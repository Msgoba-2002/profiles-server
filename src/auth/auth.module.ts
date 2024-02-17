import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthenticatedGuard } from './authenticated.guard';
import { UserIsOwnerGuard } from './user.isowner.guard';
import { SessionSerializer } from './session.serializer';

@Global()
@Module({
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    AuthenticatedGuard,
    UserIsOwnerGuard,
  ],
  controllers: [AuthController],
  imports: [UserModule, PassportModule.register({ session: true })],
  exports: [AuthenticatedGuard, UserIsOwnerGuard],
})
export class AuthModule {}
