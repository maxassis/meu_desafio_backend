import { Controller, Body, Post } from '@nestjs/common';
import {
  SignInSchemaDTO,
  SendMailCreateUserDTO,
  CheckEmailDTO,
  SendMailRecoveryDTO,
  ConfirmCodeDTO,
  SendMailDoneDTO,
} from './schemas';
import {
  SignInUseCase,
  SendMailUseCase,
  ConfirmCodeUseCase,
  SendMailRecoveryUseCase,
  SendMailRecoveryDoneUseCase,
  CheckEmailUseCase,
} from './useCase';

@Controller()
export class LoginController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly sendMailCreateUseCase: SendMailUseCase,
    private readonly confirmCodeUseCase: ConfirmCodeUseCase,
    private readonly sendMailRecoveryUseCase: SendMailRecoveryUseCase,
    private readonly sendMailDoneUseCase: SendMailRecoveryDoneUseCase,
    private readonly checkValidEmailUseCase: CheckEmailUseCase,
  ) {}

  // LOGIN
  @Post('/signin')
  async signIn(@Body() data: SignInSchemaDTO) {
    return await this.signInUseCase.execute(data);
  }

  @Post('/checkEmail')
  async checkEmail(@Body() data: CheckEmailDTO) {
    const { email } = data;
    return this.checkValidEmailUseCase.checkEmail(email);
  }

  // ROTAS DE EMAIL
  @Post('/sendMail')
  async getCode(@Body() data: SendMailCreateUserDTO) {
    const { name, email } = data;

    return await this.sendMailCreateUseCase.sendMail(name, email);
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
