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
  GetUserProfileUseCase,
} from './useCases';
import { RedisService } from 'src/infra/cache/redis/redis.service';
import { CloudflareR2Service } from 'src/infra/providers/storage/storage-r2';

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
    RedisService,
    CloudflareR2Service,
    GetUserProfileUseCase,
  ],
})
export class UserModule {}
