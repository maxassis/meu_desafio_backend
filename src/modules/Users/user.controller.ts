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
import { Supabase } from 'src/infra/providers/storage/storage-supabase';
import { extname } from 'path';

@Controller('/users')
export class UserController {
  changeEmailUseCase: any;
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly supabase: Supabase,
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

  @Post('/uploadAvatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    // console.log(file);
    const extFile = extname(file.originalname);
    const newName = `${req.user.id}${extFile}`;

    const data = await this.supabase.client.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(newName, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    return data;
  }
}
