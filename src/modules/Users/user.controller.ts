import { Body, Controller, Patch, Post, UsePipes } from '@nestjs/common';
import { CreateUserValidationPipe } from './pipe/create-user.validation.pipe';
import { ChangePasswordDTO, CreateUserSchemaDTO } from './schemas';
import { CreateUserUseCase, ChangePasswordUseCase } from './useCases';

@Controller('/users')
export class UserController {
  changeEmailUseCase: any;
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post()
  @UsePipes(new CreateUserValidationPipe())
  async createUser(@Body() data: CreateUserSchemaDTO) {
    const dt = await this.createUserUseCase.create(data);
    Reflect.deleteProperty(dt, 'password');

    return dt;
  }

  @Patch('/changePassword')
  async changePassword(@Body() data: ChangePasswordDTO) {
    const { new_password, email } = data;
    return await this.changePasswordUseCase.changePassword(email, new_password);
  }
}
