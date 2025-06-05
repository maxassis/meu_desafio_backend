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
import { Supabase } from 'src/infra/providers/storage/storage-supabase';
import { RedisService } from 'src/infra/cache/redis/redis.service';

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
    Supabase,
    RedisService,
  ],
})
export class DesafioModule {}
