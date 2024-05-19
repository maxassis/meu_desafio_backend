import { Module } from '@nestjs/common';
import { UserModule } from './modules/Users/user.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { LoginModule } from './modules/Login/login.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    UserModule,
    LoginModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'harrison.mckenzie10@ethereal.email',
          pass: 'ukbf87dyRxUpRcRBaY',
        },
        secure: false,
      },
    }),
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: 'authpassword',
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
