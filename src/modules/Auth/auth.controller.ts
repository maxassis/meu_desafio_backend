import { Controller, Body, Post, Patch } from '@nestjs/common';
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
import { ChangeEmailUseCase } from './useCase/changeEmail.usecase';
import { ChangeMailDTO } from './schemas/changeMail.schema';

@Controller()
export class LoginController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly sendMailUseCase: SendMailUseCase,
    private readonly confirmCodeUseCase: ConfirmCodeUseCase,
    private readonly sendMailRecoveryUseCase: SendMailRecoveryUseCase,
    private readonly sendMailDoneUseCase: SendMailRecoveryDoneUseCase,
    private readonly changeEmailUseCase: ChangeEmailUseCase,
  ) {}

  @Post('/signin')
  async signIn(@Body() data: SignInSchemaDTO) {
    return await this.signInUseCase.execute(data);
  }

  @Patch('/changePassword')
  async changePassword(@Body() data: ChangeMailDTO) {
    const { new_password, email } = data;
    return await this.changeEmailUseCase.changeEmail(email, new_password);
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
