import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChangePasswordDTO, CreateUserSchemaDTO } from './schemas';
import { CreateUserUseCase, ChangePasswordUseCase } from './useCases';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarUseCase } from './useCases/saveAvatar.usecase';
import { GetUserDataUseCase } from './useCases/getUserData.usecase';

@Controller('/users')
export class UserController {
  changeEmailUseCase: any;
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly getUserDataUseCase: GetUserDataUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
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

  @Get('/getUserData')
  @UseGuards(AuthGuard)
  async getUserData(@Request() req) {
    const user = this.getUserDataUseCase.getUserData(
      req.user.id,
      req.user.name,
    );

    return user;
  }

  @Post('/uploadAvatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const result = this.uploadAvatarUseCase.uploadAvatar(req.user.id, file);

    return result;
  }
}
