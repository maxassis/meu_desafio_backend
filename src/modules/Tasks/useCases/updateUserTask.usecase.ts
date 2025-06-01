import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RedisService } from '../../../infra/cache/redis/redis.service';
import { UpdateTaskDTO } from '../schemas'; // Supondo que este é o DTO correto

@Injectable()
export class UpdateUserTaskUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

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

      let progressUpdated = false;

      // Verifica se a distância foi alterada
      if (+taskExists.distanceKm !== body.distanceKm) {
        const tasks = await prisma.task.findMany({
          where: {
            usersId: userId,
            inscriptionId: taskExists.inscriptionId,
          },
        });

        // Calcula a distância total percorrida
        const totalDistance = tasks
          .reduce((acc, task) => acc + parseFloat(task.distanceKm + ''), 0)
          .toFixed(3);

        // Atualiza o progresso da inscrição com a distância total
        await prisma.inscription.update({
          where: { id: taskExists.inscriptionId },
          data: { progress: totalDistance },
        });

        progressUpdated = true;
      }

      // Busca o desafio relacionado à inscrição
      const desafio = await prisma.desafio.findFirst({
        where: {
          inscription: {
            some: {
              id: taskExists.inscriptionId,
            },
          },
        },
      });

      if (desafio) {
        await this.redisService.del(`desafio:${desafio.id}`);
        await this.redisService.del(`user:${userId}:desafios`);
        await this.redisService.del(`user:${userId}:my-desafios`);
        await this.redisService.del(
          `user:${userId}:inscription:${taskExists.inscriptionId}:tasks`,
        );
      }

      return {
        message: 'Tarefa atualizada com sucesso',
        updatedTask,
        cacheInvalidated: !!desafio,
        progressUpdated,
      };
    });
  }
}
