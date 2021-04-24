import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_USER')}>`,
        },
        // template: {
        //   dir: join(__dirname, 'templates'),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //     defaultLayout: false,
        //   },
        // },
        preview: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
