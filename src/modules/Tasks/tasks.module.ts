import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { TaskController } from './task.controller';
import {
  CreateTaskUseCase,
  DeleteUserTaskUseCase,
  GetUserTaskUseCase,
} from './useCases';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [
    PrismaService,
    GetUserTaskUseCase,
    CreateTaskUseCase,
    DeleteUserTaskUseCase,
  ],
})
export class TasksModule {}
