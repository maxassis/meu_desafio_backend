import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { CheckCompletionDTO, CreateTaskDTO, UpdateTaskDTO } from './schemas';
import {
  CreateTaskUseCase,
  DeleteUserTaskUseCase,
  GetUserTaskUseCase,
  CheckCompletionUseCase,
} from './useCases';
import { AuthGuard } from 'src/infra/providers/auth-guard.provider';
import { RequestSchemaDTO } from '../Users/schemas';
import { UpdateUserTaskUseCase } from './useCases/updateUserTask.usecase';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@Controller('/tasks')
@UsePipes(ZodValidationPipe)
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getUserTaskUseCase: GetUserTaskUseCase,
    private readonly deleteTaskUseCase: DeleteUserTaskUseCase,
    private readonly updateTaskUseCase: UpdateUserTaskUseCase,
    private readonly checkCompletionUseCase: CheckCompletionUseCase,
  ) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateTaskDTO, @Request() req: RequestSchemaDTO) {
    return this.createTaskUseCase.createTask(body, req.user.id);
  }

  @Get('/get-tasks/:inscriptionid')
  @UseGuards(AuthGuard)
  async getTasks(
    @Request() req: RequestSchemaDTO,
    @Param('inscriptionid') inscriptionid: string,
  ) {
    return this.getUserTaskUseCase.getTask(req.user.id, +inscriptionid);
  }

  @Delete('/delete-task/:taskid')
  @UseGuards(AuthGuard)
  async deleteTask(
    @Request() req: RequestSchemaDTO,
    @Param('taskid') taskId: string,
  ) {
    return this.deleteTaskUseCase.deleteTask(req.user.id, +taskId);
  }

  @Patch('/update-task/:taskid')
  @UseGuards(AuthGuard)
  async updateTask(
    @Request() req: RequestSchemaDTO,
    @Body() body: UpdateTaskDTO,
    @Param('taskid') taskId: string,
  ) {
    return this.updateTaskUseCase.updateTask(req.user.id, body, +taskId);
  }

  @Post('/check-completion')
  @UseGuards(AuthGuard)
  async checkCompletion(
    @Body() body: CheckCompletionDTO,
    @Request() req: RequestSchemaDTO,
  ) {
    return this.checkCompletionUseCase.checkCompletion(
      req.user.id,
      body.inscriptionId,
      body.distance,
    );
  }
}
