import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailgunModule } from '../mailgun/mailgun.module';

@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [MailgunModule],
})
export class EmailModule {}
