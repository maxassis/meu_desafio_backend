import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UploadedFile,
  // UploadedFile,
  UseGuards,
  UseInterceptors,
  // UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ChangePasswordDTO,
  CreateUserSchemaDTO,
  RequestSchemaDTO,
  EditUserDataDTO,
} from './schemas';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
// import { FileInterceptor } from '@nestjs/platform-express';
import {
  DeleteAvatarUseCase,
  CreateUserUseCase,
  UploadAvatarUseCase,
  GetUserDataUseCase,
  ChangePasswordUseCase,
  EditUserDataUseCase,
  GetRankingUseCase,
} from './useCases';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { FastifyRequest } from 'fastify';
import { FileFastifyInterceptor } from 'fastify-file-interceptor';

interface AuthenticatedFastifyRequest extends FastifyRequest {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface FastifyFileInterceptorFile {
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Controller('/users')
@UsePipes(ZodValidationPipe)
export class UserController {
  // changeEmailUseCase: any;
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly getUserDataUseCase: GetUserDataUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
    private readonly deleteAvatarUseCase: DeleteAvatarUseCase,
    private readonly editUserDataUseCase: EditUserDataUseCase,
    private readonly getRankingUseCase: GetRankingUseCase,
  ) {}

  @Post()
  async createUser(@Body() data: CreateUserSchemaDTO) {
    const dt = await this.createUserUseCase.create(data);
    Reflect.deleteProperty(dt, 'password');

    return dt;
  }

  @Patch('/change-password')
  async changePassword(@Body() data: ChangePasswordDTO) {
    const { new_password, email } = data;
    return this.changePasswordUseCase.changePassword(email, new_password);
  }

  @Get('/get-ranking/:desafioid')
  @UseGuards(AuthGuard)
  async getRanking(@Param('desafioid') idDesafio: string) {
    return this.getRankingUseCase.getRanking(idDesafio);
  }

  @Get('/get-user-data')
  @UseGuards(AuthGuard)
  async getUserData(@Request() req: RequestSchemaDTO) {
    return this.getUserDataUseCase.getUserData(req.user.id, req.user.name);
  }

  @Post('/upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFastifyInterceptor('file', {
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
    }),
  )
  async uploadAvatar(
    @Req() req: AuthenticatedFastifyRequest,
    @UploadedFile() file: FastifyFileInterceptorFile,
  ): Promise<any> {
    return this.uploadAvatarUseCase.uploadAvatar(req.user.id, file as any);
  }

  @Delete('/delete-avatar')
  @UseGuards(AuthGuard)
  async deleteAvatar(@Request() req: RequestSchemaDTO) {
    return this.deleteAvatarUseCase.deleteAvatar(req.user.id);
  }

  @Patch('/edit-userdata')
  @UseGuards(AuthGuard)
  async editAvatar(
    @Request() req: RequestSchemaDTO,
    @Body() newData: EditUserDataDTO,
  ) {
    return this.editUserDataUseCase.editUserData(newData, req.user.id);
  }
}
