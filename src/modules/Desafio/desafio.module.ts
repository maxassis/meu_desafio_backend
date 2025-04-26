import { Module } from '@nestjs/common';
import { DesafioController } from './desafio.controller';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  GetAllDesafioUseCase,
  GetDesafioUseCase,
  GetUserDesafioUseCase,
  RegisterUserDesafioUseCase,
  CreateDesafioUseCase,
} from './useCase';

@Module({
  imports: [],
  controllers: [DesafioController],
  providers: [
    CreateDesafioUseCase,
    PrismaService,
    RegisterUserDesafioUseCase,
    GetUserDesafioUseCase,
    GetDesafioUseCase,
    GetAllDesafioUseCase,
  ],
})
export class DesafioModule {}
