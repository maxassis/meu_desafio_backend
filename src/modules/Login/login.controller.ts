import { Controller, Body, Post, Get } from '@nestjs/common';
import { SignInUseCase } from './useCase/signin.usecase';
import { SignInSchemaDTO } from './schemas/signin-schema';
import { GetCodeUseCase } from './useCase/getCode.usecase';

@Controller()
export class LoginController {
  constructor(
    private readonly signInUseCase: SignInUseCase,
    private readonly getCodeUseCase: GetCodeUseCase,
  ) {}

  @Post('/signin')
  async signIn(@Body() data: SignInSchemaDTO) {
    return await this.signInUseCase.execute(data);
  }

  @Get('/code')
  async getCode() {
    return await this.getCodeUseCase.execute();
  }
}
