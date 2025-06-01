import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RedisService } from '../../../infra/cache/redis/redis.service';

@Injectable()
export class DeleteUserTaskUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async deleteTask(userId: string, taskId: number) {
    try {
      // Verificar se a tarefa pertence ao usuário
      const task = await this.prisma.task.findFirst({
        where: {
          id: taskId,
          Users: {
            id: userId,
          },
        },
      });

      if (!task) {
        throw new HttpException(
          'Nenhuma tarefa encontrada para o usuário e desafio especificados',
          HttpStatus.NOT_FOUND,
        );
      }

      // Deleta a tarefa
      await this.prisma.task.delete({
        where: {
          id: taskId,
        },
      });

      // Busca todas as tarefas restantes do usuário com o ID de inscrição fornecido
      const tasks = await this.prisma.task.findMany({
        where: {
          usersId: userId,
          inscriptionId: task.inscriptionId,
        },
      });

      // Calcula a distância total percorrida
      const totalDistance = tasks
        .reduce((acc, task) => acc + parseFloat(task.distanceKm + ''), 0)
        .toFixed(3);

      // Atualiza o progresso da inscrição
      await this.prisma.inscription.update({
        where: { id: task.inscriptionId },
        data: { progress: totalDistance },
      });

      // Busca o desafio relacionado à inscrição para invalidar o cache
      const desafio = await this.prisma.desafio.findFirst({
        where: {
          inscription: {
            some: {
              id: task.inscriptionId,
            },
          },
        },
      });

      if (desafio) {
        await this.redisService.del(`desafio:${desafio.id}`);
      }

      return {
        message: 'Tarefa deletada com sucesso',
      };
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw new HttpException(
        'Erro ao deletar a tarefa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
