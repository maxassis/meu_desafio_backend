import { Module } from '@nestjs/common';
import { LoginController } from './auth.controller';
import { PrismaService } from 'src/infra/database/prisma.service';
import { SignInUseCase } from './useCase/signin.usecase';
import { JwtModule } from '@nestjs/jwt';
import { SendMailUseCase } from './useCase/sendmail.createuser.usecase';
import { ConfirmCodeUseCase } from './useCase/sendmail.confirmCode.usercase';
import { SendMailRecoveryUseCase } from './useCase/sendmail.recovery.usecase';
import { SendMailRecoveryDoneUseCase } from './useCase/sendmail.recovery.done';
import { CheckEmailUseCase } from './useCase/sendmail.checkValidEmail.usecase';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '90d' },
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
  ],
  exports: [],
})
export class LoginModule {}
