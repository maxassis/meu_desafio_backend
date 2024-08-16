import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class DeleteUserTaskUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async deleteTask(userId: string, taskId: number) {
    try {
      // Verificar se a tarefa pertence ao usuário e ao desafio
      const task = await this.prisma.task.findFirst({
        where: {
          id: taskId,
          Users: {
            id: userId,
          },
        },
      });

      // console.log(task);

      if (!task) {
        throw new HttpException(
          'Nenhuma tarefa encontrada para o usuário e desafio especificados',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.task.delete({
        where: {
          id: taskId,
        },
      });

      // Busca todas as tarefas do usuário com o ID de participação fornecido
      const tasks = await this.prisma.task.findMany({
        where: {
          usersId: userId,
          participationId: task.participationId,
        },
      });

      // Calcula a distância total percorrida
      const totalDistance = tasks
        .reduce((acc, task) => acc + parseFloat(task.distanceKm + ''), 0)
        .toFixed(3);

      // Atualiza o progresso da participação com a distância total
      await this.prisma.participation.update({
        where: { id: task.participationId },
        data: { progress: totalDistance },
      });

      return {
        message: 'Tarefa deletada com sucesso',
      };
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  }
}
