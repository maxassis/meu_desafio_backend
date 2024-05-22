import { Controller, Body, Post } from '@nestjs/common';
import { SignInUseCase } from './useCase/signin.usecase';
import { SignInSchemaDTO } from './schemas/signin-schema';
import { SendMailUseCase } from './useCase/sendmail.createuser.usecase';
import { SendMailCreateUserDTO } from './schemas/sendMail.createuser.schema';

@Controller()
export class LoginController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly sendMailUseCase: SendMailUseCase,
  ) {}

  @Post('/signin')
  async signIn(@Body() data: SignInSchemaDTO) {
    return await this.signInUseCase.execute(data);
  }

  @Post('/sendMail')
  async getCode(@Body() data: SendMailCreateUserDTO) {
    const { name, email } = data;

    return await this.sendMailUseCase.sendMail(name, email);
  }
}
