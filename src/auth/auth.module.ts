import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  imports: [UserModule, PassportModule.register({ session: true })],
})
export class AuthModule {}