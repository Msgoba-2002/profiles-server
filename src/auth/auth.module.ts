import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthenticatedGuard } from './authenticated.guard';
import { UserIsOwnerGuard } from './user.isowner.guard';
import { SessionSerializer } from './session.serializer';
import { GoogleStrategy } from './google.strategy';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    SessionSerializer,
    AuthenticatedGuard,
    UserIsOwnerGuard,
  ],
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: 600 },
    }),
  ],
  exports: [AuthenticatedGuard, UserIsOwnerGuard],
})
export class AuthModule {}
