import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateTaskDTO } from '../schemas';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(body: CreateTaskDTO, id: string) {
    const createUserTask = await this.prisma.task.create({
      data: {
        name: body.name!,
        environment: 'esteira',
        date: body.date,
        duration: body.duration,
        calories: body.calories,
        local: body.local,
        distanceKm: 11,
        participationId: 21,
        usersId: id,
      },
    });

    if (!createUserTask) {
      throw new HttpException('Error', HttpStatus.NOT_FOUND);
    }

    return body;
  }
}
