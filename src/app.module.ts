import { Module } from '@nestjs/common';
import { UserModule } from './modules/Users/user.module';
import { LoginModule } from './modules/Auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { DesafioModule } from './modules/Desafio/desafio.module';
import { TasksModule } from './modules/Tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { envSchema } from './env';
import { MailConsumer } from './jobs/sendmail-consumer';

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
        // url: process.env.REDIS_URL,
        host: 'localhost',
        port: Number(process.env.REDIS_PORT),
        // password: 'authpassword',
      },
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],
  controllers: [],
  providers: [MailConsumer],
})
export class AppModule {}
