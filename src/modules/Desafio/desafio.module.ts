import { Module } from '@nestjs/common';
import { DesafioController } from './desafio.controller';
import { CreateDesafioUseCase } from './useCase/createDesafio.usecase';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RegisterUserDesafioUseCase } from './useCase/registerUserDesafio.usecase';
import { GetUserDesafioUseCase } from './useCase/getUserDesafio.usecase';

@Module({
  imports: [],
  controllers: [DesafioController],
  providers: [
    CreateDesafioUseCase,
    PrismaService,
    RegisterUserDesafioUseCase,
    GetUserDesafioUseCase,
  ],
})
export class DesafioModule {}
