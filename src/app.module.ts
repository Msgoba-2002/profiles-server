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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { StorageModule } from './storage/storage.module';
import { ProfileModule } from './profile/profile.module';

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
    ThrottlerModule.forRoot([
      {
        ttl: 60 * 1000,
        limit: 20,
      },
    ]),
    EmailModule,
    MailgunModule,
    AwsS3Module,
    StorageModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useClass: ThrottlerGuard }],
})
export class AppModule {}
