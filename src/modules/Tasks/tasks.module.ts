import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { TaskController } from './task.controller';
import {
  CreateTaskUseCase,
  DeleteUserTaskUseCase,
  GetUserTaskUseCase,
} from './useCases';
import { UpdateUserTaskUseCase } from './useCases/updateUserTask.usecase';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [
    PrismaService,
    GetUserTaskUseCase,
    CreateTaskUseCase,
    DeleteUserTaskUseCase,
    UpdateUserTaskUseCase,
  ],
})
export class TasksModule {}
