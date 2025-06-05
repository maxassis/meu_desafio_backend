import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { TaskController } from './task.controller';
import {
  CheckCompletionUseCase,
  CreateTaskUseCase,
  DeleteUserTaskUseCase,
  GetUserTaskUseCase,
} from './useCases';
import { UpdateUserTaskUseCase } from './useCases/updateUserTask.usecase';
import { RedisService } from 'src/infra/cache/redis/redis.service';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [
    PrismaService,
    GetUserTaskUseCase,
    CreateTaskUseCase,
    DeleteUserTaskUseCase,
    UpdateUserTaskUseCase,
    CheckCompletionUseCase,
    RedisService,
  ],
})
export class TasksModule {}
