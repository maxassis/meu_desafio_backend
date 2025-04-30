import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateTaskDTO } from '../schemas';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly prisma: PrismaService) {}
  async createTask(body: CreateTaskDTO, id: string) {
    try {
      // Verificar se o usuário está cadastrado no desafio
      const userInscription = await this.prisma.inscription.findFirst({
        where: {
          id: body.inscriptionId,
          userId: id,
        },
      });

      if (!userInscription) {
        throw new HttpException(
          'Usuário não está cadastrado no desafio',
          HttpStatus.FORBIDDEN,
        );
      }

      // Verificar se o desafio já está completo
      if (userInscription.completed) {
        throw new HttpException(
          'Este desafio já foi concluído. Não é possível adicionar novas tarefas.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Inicia a transação
      return await this.prisma.$transaction(async (prisma) => {
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
            inscriptionId: body.inscriptionId,
            usersId: id,
          },
        });

        if (!createUserTask) {
          throw new HttpException(
            'Erro ao criar a tarefa',
            HttpStatus.NOT_FOUND,
          );
        }

        // Busca todas as tarefas do usuário com o ID de incrição fornecido
        const tasks = await prisma.task.findMany({
          where: {
            usersId: id,
            inscriptionId: body.inscriptionId,
          },
        });

        // Calcula a distância total percorrida
        const totalDistance = tasks
          .reduce((acc, task) => acc + parseFloat(task.distanceKm + ''), 0)
          .toFixed(3);

        // Busca informações do desafio para verificar se foi concluído
        const desafio = await prisma.desafio.findFirst({
          where: {
            inscription: {
              some: {
                id: body.inscriptionId,
              },
            },
          },
        });

        if (!desafio) {
          throw new HttpException(
            'Desafio não encontrado',
            HttpStatus.NOT_FOUND,
          );
        }

        const isCompleted =
          parseFloat(totalDistance) >= parseFloat(desafio.distance.toString());

        // Define o progresso a ser salvo
        // Se o desafio estiver completo, usa o valor exato do percurso total do desafio
        // Caso contrário, usa a soma calculada das distâncias
        const progressToSave = isCompleted ? desafio.distance : totalDistance;

        // Atualiza o progresso da inscrição
        // Se concluído, marca como completado e adiciona a data de conclusão
        await prisma.inscription.update({
          where: { id: body.inscriptionId },
          data: {
            progress: progressToSave,
            completed: isCompleted,
            completedAt: isCompleted ? new Date() : null,
          },
        });

        // Retorna a resposta dentro da transação
        return {
          message: 'Tarefa criada com sucesso',
          task: body,
        };
      });
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Erro ao criar a tarefa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
