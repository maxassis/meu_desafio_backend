import { Module } from '@nestjs/common';
import { DesafioController } from './desafio.controller';
import { CreateDesafioUseCase } from './useCases/createDesafio.usecase';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RegisterUserDesafioUseCase } from './useCases/registerUserDesafio.usecase';

@Module({
  imports: [],
  controllers: [DesafioController],
  providers: [CreateDesafioUseCase, PrismaService, RegisterUserDesafioUseCase],
})
export class DesafioModule {}
