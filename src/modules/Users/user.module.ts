import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './useCases/create-user.usecase';
import { PrismaService } from 'src/infra/database/prisma.service';
import { ChangePasswordUseCase } from './useCases/changePassword.usecase';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [CreateUserUseCase, PrismaService, ChangePasswordUseCase],
})
export class UserModule {}
