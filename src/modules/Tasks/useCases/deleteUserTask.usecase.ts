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

      console.log(task);

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

      return 'Tarefa deletada com sucesso';
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  }
}
