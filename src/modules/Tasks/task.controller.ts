import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateTaskDTO } from './schemas';
import {
  CreateTaskUseCase,
  DeleteUserTaskUseCase,
  GetUserTaskUseCase,
} from './useCases';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { RequestSchemaDTO } from '../Users/schemas';

@Controller('/tasks')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getUserTaskUseCase: GetUserTaskUseCase,
    private readonly deleteTaskUseCase: DeleteUserTaskUseCase,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateTaskDTO, @Request() req: RequestSchemaDTO) {
    return this.createTaskUseCase.createTask(body, req.user.id);
  }

  @Get('/get-tasks/:participationId')
  @UseGuards(AuthGuard)
  async getTasks(
    @Request() req: RequestSchemaDTO,
    @Param() { participationId }: { participationId: string },
  ) {
    return this.getUserTaskUseCase.getTask(req.user.id, +participationId);
  }

  @Delete('/delete-task/:taskId')
  @UseGuards(AuthGuard)
  async deleteTask(
    @Request() req: RequestSchemaDTO,
    @Param() { taskId }: { taskId: string },
  ) {
    return this.deleteTaskUseCase.deleteTask(req.user.id, +taskId);
  }
}
