import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetUserTaskUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getTask(userId: string, participationId: number) {
    const task = await this.prisma.task.findMany({
      where: {
        usersId: userId,
        participationId: participationId,
      },
    });

    // console.log(task);

    return task;
  }
}
