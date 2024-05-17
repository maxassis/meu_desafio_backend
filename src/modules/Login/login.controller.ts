import { Controller, Body, Post } from '@nestjs/common';
import { SignInUseCase } from './useCase/signin.usecase';
import { SignInSchemaDTO } from './schemas/signin-schema';

@Controller()
export class LoginController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  @Post('/signin')
  async signIn(@Body() data: SignInSchemaDTO) {
    return await this.signInUseCase.execute(data);
  }
}
