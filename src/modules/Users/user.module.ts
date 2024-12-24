import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './useCases/create-user.usecase';
import { PrismaService } from 'src/infra/database/prisma.service';
import { ChangePasswordUseCase } from './useCases/changePassword.usecase';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';
import { UploadAvatarUseCase } from './useCases/saveAvatar.usecase';
import { GetUserDataUseCase } from './useCases/getUserData.usecase';
import { DeleteAvatarUseCase, EditUserDataUseCase } from './useCases';
import { MailService } from 'src/jobs/sendmail-producer-service';
import { BullModule } from '@nestjs/bullmq';
import { MailConsumer } from 'src/jobs/sendmail-consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
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
    MailService,
    MailConsumer,
  ],
})
export class UserModule {}
