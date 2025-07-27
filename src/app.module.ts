import { Module } from '@nestjs/common';
import { UserModule } from './modules/Users/user.module';
import { LoginModule } from './modules/Auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { DesafioModule } from './modules/Desafio/desafio.module';
import { TasksModule } from './modules/Tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { StripeModule } from './modules/Payment/payment.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    UserModule,
    DesafioModule,
    LoginModule,
    TasksModule,
    StripeModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'salvatore76@ethereal.email',
          pass: '2RQhYDY6Cvs2hGbwpf',
        },
        secure: false,
      },
    }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
