import { Controller, Body, Post } from '@nestjs/common';
import { SignInUseCase } from './useCase/signin.usecase';
import { SignInSchemaDTO } from './schemas/signin-schema';
import { SendMailUseCase } from './useCase/sendmail.createuser.usecase';
import { SendMailCreateUserDTO } from './schemas/sendMail.createuser.schema';
import { SendMailRecoveryDTO } from './schemas/sendMail.recovery.schema';
import { ConfirmCodeUseCase } from './useCase/confirmCode.usercase';
import { ConfirmCodeDTO } from './schemas/confirmCode.schema';
import { SendMailRecoveryUseCase } from './useCase/sendmail.recovery.usecase';
import { SendMailDoneDTO } from './schemas/sendMail.recovery.done';
import { SendMailRecoveryDoneUseCase } from './useCase/sendmail.recovery.done';

@Controller()
export class LoginController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly sendMailUseCase: SendMailUseCase,
    private readonly confirmCodeUseCase: ConfirmCodeUseCase,
    private readonly sendMailRecoveryUseCase: SendMailRecoveryUseCase,
    private readonly sendMailDoneUseCase: SendMailRecoveryDoneUseCase,
  ) {}

  @Post('/signin')
  async signIn(@Body() data: SignInSchemaDTO) {
    return await this.signInUseCase.execute(data);
  }

  // ROTAS DE EMAIL
  @Post('/sendMail')
  async getCode(@Body() data: SendMailCreateUserDTO) {
    const { name, email } = data;

    return await this.sendMailUseCase.sendMail(name, email);
  }

  @Post('/confirmCode')
  async confirmCode(@Body() data: ConfirmCodeDTO) {
    const { code, email } = data;
    return await this.confirmCodeUseCase.confirmCode(code, email);
  }

  @Post('/sendMailRecovery')
  async RecoveryMail(@Body() data: SendMailRecoveryDTO) {
    const { email } = data;
    return await this.sendMailRecoveryUseCase.sendMailRecovery(email);
  }

  @Post('/sendMailDone')
  async sendMailDone(@Body() data: SendMailDoneDTO) {
    const { email } = data;
    return await this.sendMailDoneUseCase.sendMailDone(email);
  }
}
