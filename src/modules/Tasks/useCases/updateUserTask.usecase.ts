import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UpdateTaskDTO } from '../schemas'; // Supondo que este é o DTO correto para a operação de atualização

@Injectable()
export class UpdateUserTaskUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async updateTask(userId: string, body: UpdateTaskDTO, taskId: number) {
    // Verifica se a tarefa existe e pertence ao usuário
    const taskExists = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        usersId: userId,
      },
    });

    if (!taskExists) {
      throw new HttpException('Tarefa não encontrada', HttpStatus.NOT_FOUND);
    }

    return this.prisma.$transaction(async (prisma) => {
      // Atualiza a tarefa
      const updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          ...body,
        },
      });

      // Verifica se a distância foi alterada
      if (+taskExists.distanceKm !== body.distanceKm) {
        const tasks = await prisma.task.findMany({
          where: {
            usersId: userId,
            participationId: taskExists.participationId,
          },
        });

        // Calcula a distância total percorrida
        const totalDistance = tasks
          .reduce((acc, task) => acc + parseFloat(task.distanceKm + ''), 0)
          .toFixed(3);

        // Atualiza o progresso da participação com a distância total
        await prisma.participation.update({
          where: { id: taskExists.participationId },
          data: { progress: totalDistance },
        });
      }

      return updatedTask;
    });
  }
}
