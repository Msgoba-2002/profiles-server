export interface IMailgunMailOptions {
  to: string;
  from: string;
  subject: string;
  template?: string;
  'h:X-Mailgun-Variables'?: string;
}
