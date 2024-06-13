import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './useCases/create-user.usecase';
import { PrismaService } from 'src/infra/database/prisma.service';
import { ChangePasswordUseCase } from './useCases/changePassword.usecase';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';
import { UploadAvatarUseCase } from './useCases/saveAvatar.usecase';
import { GetUserDataUseCase } from './useCases/getUserData.usecase';

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
  ],
})
export class UserModule {}
