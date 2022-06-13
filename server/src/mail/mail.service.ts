import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as Sendgrid from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    Sendgrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  getLink(verificationCode: string, username: string): string {
    const base =
      process.env.NODE_ENV === 'production'
        ? 'https://gomoku.vanata.dev/verify'
        : 'http://localhost:8080/verify';

    return `${base}?code=${verificationCode}&username=${username}`;
  }

  async send(mail: Sendgrid.MailDataRequired) {
    const transport = await Sendgrid.send(mail);

    return transport;
  }

  async sendDummyMail(email: string) {
    const mail: Sendgrid.MailDataRequired = {
      to: email,
      subject: 'Dummy mail',
      from: 'mail@vanata.dev',
      text: "Hi, I'm a dummmy email.",
      html: "<h1>Hi, I'm a dummy mail</h1><p>There is a paragraph of text</p>",
    };
    return await Sendgrid.send(mail);
  }
  async sendVerificationEmail(
    email: string,
    username: string,
    verificationToken: string,
  ) {
    const link = this.getLink(verificationToken, username);
    const mail: Sendgrid.MailDataRequired = {
      to: email,
      subject: 'Gomoku - Email Verification',
      from: 'mail@vanata.dev',
      text: `<h1>Email verification</h1><p>Confirm your email by visiting <br> ${link} <br> With regards Gomoku team</p>`,
      html: `<h1>Email verification</h1><p>Confirm your email by visiting <br> ${link} <br> With regards Gomoku team</p>`,
    };

    return await this.send(mail);
  }
}
