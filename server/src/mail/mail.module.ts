import { MailController } from './mail.controller';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [ConfigService],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
