import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { IMailgunMailOptions } from './mailgun.types';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class MailgunService {
  private mgKey: string;
  private mgUrl: string;
  private mgFrom: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.mgKey = this.configService.get('MAILGUN_API_KEY');
    this.mgUrl = this.configService.get('MAILGUN_API_URL');
    this.mgFrom = this.configService.get('MAILGUN_SENDER_EMAIL');
  }

  async send(mailData: IMailgunMailOptions) {
    const mailForm = new FormData();
    Object.keys(mailData).forEach((key) => {
      mailForm.append(key, mailData[key]);
    });
    const { data } = await firstValueFrom(
      this.httpService.post(this.mgUrl, mailForm).pipe(
        catchError((err: AxiosError) => {
          console.error(err);
          throw err;
        }),
      ),
    );
    return data;
  }
}
