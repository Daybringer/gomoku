/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Param, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('dummy')
  async sendDummy(@Body() body: { email: string }) {
    return this.mailService.sendDummyMail(body.email);
  }
}
