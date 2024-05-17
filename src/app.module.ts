import { Module } from '@nestjs/common';
import { UserModule } from './modules/Users/user.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { LoginModule } from './modules/Login/login.module';

@Module({
  imports: [UserModule, LoginModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
