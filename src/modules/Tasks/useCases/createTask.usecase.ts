import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateTaskDTO } from '../schemas';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(body: CreateTaskDTO, id: string) {
    // Verificar se o usuário está cadastrado na participação
    const userParticipation = await this.prisma.participation.findFirst({
      where: {
        id: body.participationId,
        userId: id,
      },
    });

    if (!userParticipation) {
      throw new HttpException(
        'Usuário não está cadastrado na participação',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        // Cria uma nova tarefa para o usuário
        const createUserTask = await prisma.task.create({
          data: {
            name: body.name!,
            environment: body.environment,
            date: body.date,
            duration: body.duration,
            calories: body.calories,
            local: body.local,
            distanceKm: body.distance,
            participationId: body.participationId,
            usersId: id,
          },
        });

        if (!createUserTask) {
          throw new HttpException(
            'Erro ao criar a tarefa 1',
            HttpStatus.NOT_FOUND,
          );
        }

        // Busca todas as tarefas do usuário com o ID de participação fornecido
        const tasks = await prisma.task.findMany({
          where: {
            usersId: id,
            participationId: body.participationId,
          },
        });

        // Calcula a distância total percorrida
        const totalDistance = tasks
          .reduce((acc, task) => acc + parseFloat(task.distanceKm + ''), 0)
          .toFixed(3);

        // Atualiza o progresso da participação com a distância total
        await prisma.participation.update({
          where: { id: body.participationId },
          data: { progress: totalDistance },
        });
      });

      return {
        message: 'Tarefa criada com sucesso',
        task: body,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao criar a tarefa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
