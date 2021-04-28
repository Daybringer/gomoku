import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      host: configService.get('MAIL_HOST'),
      port: configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }

  sendVerificationEmail(email: string, verificationToken: string) {
    const domain =
      process.env.NODE_ENV === 'production'
        ? 'https://gomoku.vanata.dev/auth/verify/'
        : 'localhost:3000/auth/verify/';

    const link = domain + verificationToken;

    this.sendMail({
      from: 'vanata.michal@gmail.com',
      to: email,
      subject: 'Email verification',
      text: '',
      html: `<h1>Email verification for Gomoku app</h1>
        <h3>Click on this link to verify the email</h3>
        <a href="${link}">${link}</a>
        <br>
        If you haven't registered, it's safe to ignore this mail.
      `,
    });
  }
}
