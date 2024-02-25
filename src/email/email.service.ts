import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import {
  PasswordResetEvent,
  PasswordResetRequestEvent,
  // PasswordResetRequestEvent,
  UserRegisteredEvent,
} from '../types/events.types';
import { MailgunService } from '../mailgun/mailgun.service';

@Injectable()
export class EmailService {
  private readonly verificationTemplateId: string;
  private readonly reqPassResetTemplateId: string;
  private readonly passResetTemplateId: string;
  private readonly sender: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailgunService: MailgunService,
  ) {
    this.sender = this.configService.get('MAILGUN_SENDER_EMAIL');
    this.verificationTemplateId = this.configService.get('VERIFY_TEMPLATE_ID');
    this.reqPassResetTemplateId = this.configService.get(
      'REQ_PW_RESET_TEMPLATE_ID',
    );
    this.passResetTemplateId = this.configService.get('PW_RESET_TEMPLATE_ID');
  }

  @OnEvent('user.registered')
  async sendVerificationEmail(payload: UserRegisteredEvent) {
    const { user, verificationUrl } = payload;

    const dynamicTemplateData = {
      user_name: `${user.first_name} ${user.last_name}`,
      verify_url: verificationUrl,
    };

    const msg = {
      to: user.email,
      from: this.sender,
      subject: 'Please verify your email address',
      template: this.verificationTemplateId,
      't:variables': JSON.stringify(dynamicTemplateData),
    };

    try {
      const sentMail = await this.mailgunService.send(msg);
      if (sentMail) {
        console.log(
          `Verification email sent successfully to ${user.first_name} ${user.last_name} at ${user.email}`,
        );
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @OnEvent('user.reqPwReset')
  async sendReqPwResetEmail(payload: PasswordResetRequestEvent) {
    const { user, resetUrl } = payload;

    const dynamicTemplateData = {
      user_name: `${user.first_name} ${user.last_name}`,
      pw_reset_url: resetUrl,
    };

    const msg = {
      to: user.email,
      from: this.sender,
      subject: 'Password Reset Request',
      template: this.reqPassResetTemplateId,
      't:variables': JSON.stringify(dynamicTemplateData),
    };

    try {
      const sentMail = this.mailgunService.send(msg);
      if (sentMail) {
        console.log(
          `Password reset request email sent successfully to ${user.first_name} ${user.last_name} at ${user.email}`,
        );
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @OnEvent('user.pwReset')
  async sendPwResetEmail(payload: PasswordResetEvent) {
    const { user } = payload;

    const dynamicTemplateData = {
      user_name: `${user.first_name} ${user.last_name}`,
    };

    const msg = {
      to: user.email,
      from: this.sender,
      template: this.passResetTemplateId,
      subject: 'Password Reset Successful',
      't:variables': JSON.stringify(dynamicTemplateData),
    };

    try {
      this.mailgunService.send(msg);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
