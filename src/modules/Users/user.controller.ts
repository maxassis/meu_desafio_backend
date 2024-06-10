import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChangePasswordDTO, CreateUserSchemaDTO } from './schemas';
import { CreateUserUseCase, ChangePasswordUseCase } from './useCases';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';

@Controller('/users')
export class UserController {
  changeEmailUseCase: any;
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post()
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

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Request() req) {
    console.log(req.user);

    return 'ok';
  }
}
