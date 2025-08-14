import { Module } from '@nestjs/common';
import { LoginController } from './auth.controller';
import { PrismaService } from 'src/infra/database/prisma.service';
import { SignInUseCase } from './useCase/signin.usecase';
import { JwtModule } from '@nestjs/jwt';
import { SendMailUseCase } from './useCase/sendmail.createuser.usecase';
import { ConfirmCodeUseCase } from './useCase/sendmail.confirmCode.usercase';
import { SendMailRecoveryUseCase } from './useCase/sendmail.recovery.usecase';
import { SendMailRecoveryDoneUseCase } from './useCase/sendmail.recovery.done';
import { CheckEmailUseCase } from './useCase/checkValidEmail.usecase';
import { RedisService } from 'src/infra/cache/redis/redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [LoginController],
  providers: [
    PrismaService,
    SignInUseCase,
    SendMailUseCase,
    SendMailRecoveryUseCase,
    ConfirmCodeUseCase,
    SendMailRecoveryDoneUseCase,
    CheckEmailUseCase,
    RedisService,
  ],
  exports: [],
})
export class LoginModule {}
