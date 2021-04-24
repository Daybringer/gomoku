import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendVerifyEmail(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify email',
      template: 'confirmation',
      context: {
        name: 'Random name',
        url: 'https://gomoku.vanata.dev',
      },
    });
  }
}
