import { Module } from '@nestjs/common';
import { MailgunService } from './mailgun.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      auth: {
        username: 'api',
        password: process.env.MAILGUN_API_KEY,
      },
    }),
  ],
  providers: [MailgunService],
  exports: [MailgunService],
})
export class MailgunModule {}
