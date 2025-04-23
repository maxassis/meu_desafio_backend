import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';
import {
  DeleteAvatarUseCase,
  EditUserDataUseCase,
  GetRankingUseCase,
  CreateUserUseCase,
  UploadAvatarUseCase,
  GetUserDataUseCase,
  ChangePasswordUseCase,
} from './useCases';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    PrismaService,
    ChangePasswordUseCase,
    Supabase,
    UploadAvatarUseCase,
    GetUserDataUseCase,
    DeleteAvatarUseCase,
    EditUserDataUseCase,
    GetRankingUseCase,
  ],
})
export class UserModule {}
