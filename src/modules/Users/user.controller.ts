import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ChangePasswordDTO,
  CreateUserSchemaDTO,
  RequestSchemaDTO,
  DeleteAvatarDTO,
  EditUserDataDTO,
} from './schemas';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  DeleteAvatarUseCase,
  CreateUserUseCase,
  UploadAvatarUseCase,
  GetUserDataUseCase,
  ChangePasswordUseCase,
  EditUserDataUseCase,
} from './useCases';

@Controller('/users')
export class UserController {
  changeEmailUseCase: any;
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly getUserDataUseCase: GetUserDataUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
    private readonly deleteAvatarUseCase: DeleteAvatarUseCase,
    private readonly editUserDataUseCase: EditUserDataUseCase,
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
    return this.changePasswordUseCase.changePassword(email, new_password);
  }

  @Get('/getUserData')
  @UseGuards(AuthGuard)
  async getUserData(@Request() req: RequestSchemaDTO) {
    return this.getUserDataUseCase.getUserData(req.user.id, req.user.name);
  }

  @Post('/uploadAvatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req: RequestSchemaDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.uploadAvatarUseCase.uploadAvatar(req.user.id, file);
  }

  @Delete('/deleteAvatar/:param')
  @UseGuards(AuthGuard)
  async deleteAvatar(
    @Request() req: RequestSchemaDTO,
    @Body() { filename }: DeleteAvatarDTO,
  ) {
    return this.deleteAvatarUseCase.deleteAvatar(filename, req.user.id);
  }

  @Patch('/editUserData')
  @UseGuards(AuthGuard)
  async editAvatar(
    @Request() req: RequestSchemaDTO,
    @Body() newData: EditUserDataDTO,
  ) {
    return this.editUserDataUseCase.editUserData(newData, req.user.id);
  }
}
