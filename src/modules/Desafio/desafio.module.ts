import { Module } from '@nestjs/common';
import { DesafioController } from './desafio.controller';
import { CreateDesafioUseCase } from './useCases/createDesafio.usecase';
import { PrismaService } from 'src/infra/database/prisma.service';

@Module({
  imports: [],
  controllers: [DesafioController],
  providers: [CreateDesafioUseCase, PrismaService],
})
export class DesafioModule {}
