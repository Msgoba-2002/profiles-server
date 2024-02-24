import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async sendEmail(msg: sgMail.MailDataRequired) {
    try {
      const sentMail = await sgMail.send(msg);
      if (sentMail) {
        return sentMail;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
