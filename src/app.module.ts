import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './email/email.module';
import { MailgunModule } from './mailgun/mailgun.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({ delimiter: '.' }),
    EmailModule,
    MailgunModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
