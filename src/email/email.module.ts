import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendgridModule } from '../sendgrid/sendgrid.module';

@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [SendgridModule],
})
export class EmailModule {}
