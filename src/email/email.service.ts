import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import {
  PasswordResetEvent,
  PasswordResetRequestEvent,
  // PasswordResetRequestEvent,
  UserRegisteredEvent,
} from '../types/events.types';
import { SendgridService } from '../sendgrid/sendgrid.service';

@Injectable()
export class EmailService {
  private readonly verificationTemplateId: string;
  private readonly reqPassResetTemplateId: string;
  private readonly passResetTemplateId: string;
  private readonly sender: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly sendgridService: SendgridService,
  ) {
    this.sender = this.configService.get('SENDGRID_SENDER_EMAIL');
    this.verificationTemplateId = this.configService.get('VERIFY_TEMPLATE_ID');
    this.reqPassResetTemplateId = this.configService.get(
      'REQ_PW_RESET_TEMPLATE_ID',
    );
    this.passResetTemplateId = this.configService.get('PW_RESET_TEMPLATE_ID');
  }

  @OnEvent('user.registered')
  async sendVerificationEmail(payload: UserRegisteredEvent) {
    const { user, verificationUrl } = payload;

    const msg = {
      to: user.email,
      from: this.sender,
      templateId: this.configService.get('VERIFY_TEMPLATE_ID'),
      dynamicTemplateData: {
        user_name: user.first_name,
        verify_url: verificationUrl,
      },
    };

    try {
      const sentMail = await this.sendgridService.sendEmail(msg);
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

    const msg = {
      to: user.email,
      from: this.sender,
      templateId: this.reqPassResetTemplateId,
      dynamicTemplateData: {
        user_name: user.first_name,
        pw_reset_url: resetUrl,
      },
    };

    try {
      const sentMail = await this.sendgridService.sendEmail(msg);
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

    const msg = {
      to: user.email,
      from: this.sender,
      templateId: this.passResetTemplateId,
      dynamicTemplateData: {
        user_name: `${user.first_name} ${user.last_name}`,
      },
    };

    try {
      const sentMail = await this.sendgridService.sendEmail(msg);
      if (sentMail) {
        console.log(
          `Password reset email sent successfully to ${user.first_name} ${user.last_name} at ${user.email}`,
        );
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
