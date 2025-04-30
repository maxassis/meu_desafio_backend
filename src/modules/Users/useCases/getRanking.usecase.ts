import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetRankingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getRanking(desafioId: string) {
    // Obter o desafio para saber a distância total
    const desafio = await this.prisma.desafio.findUnique({
      where: {
        id: +desafioId,
      },
    });

    if (!desafio) {
      throw new Error(`Desafio com ID ${desafioId} não encontrado`);
    }

    // Obter todas as inscriçoes para este desafio com seus usuários e tarefas
    const inscriptions = await this.prisma.inscription.findMany({
      where: {
        desafioId: +desafioId,
      },
      include: {
        user: {
          include: {
            UserData: true,
          },
        },
        tasks: {
          orderBy: {
            date: 'asc',
          },
          select: {
            distanceKm: true,
            duration: true,
            date: true,
            createdAt: true,
          },
        },
      },
    });

    const now = new Date();

    // Processar os dados para calcular taxa de progresso
    const rankings = inscriptions.map((inscription) => {
      // Calcular a distância total percorrida nas tarefas
      const totalDistance = inscription.tasks.reduce(
        (sum, task) => sum + Number(task.distanceKm),
        0,
      );

      // Calcular duração total das tarefas
      const totalDuration = inscription.tasks.reduce(
        (sum, task) => sum + Number(task.duration),
        0,
      );

      // Data da primeira tarefa ou data de criação da inscrição
      // Precisamos incluir a propriedade createdAt no select da inscrição
      let startDate = new Date();
      if (inscription.tasks.length > 0) {
        if (inscription.tasks[0].date) {
          startDate = new Date(inscription.tasks[0].date);
        } else if (inscription.tasks[0].createdAt) {
          startDate = new Date(inscription.tasks[0].createdAt);
        }
      }

      // Calcular dias desde o início
      const daysSinceStart = Math.max(
        1,
        Math.ceil(
          (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        ),
      );

      // Calcular progresso como porcentagem da distância total do desafio
      const progressPercent =
        (Number(inscription.progress) / Number(desafio.distance)) * 100;

      // Taxa de progresso diário (porcentagem por dia)
      const dailyProgressRate = progressPercent / daysSinceStart;

      // Bônus de conclusão, se aplicável
      const completionBonus =
        inscription.completed && inscription.completedAt
          ? 100 *
            (1 -
              Math.ceil(
                (new Date(inscription.completedAt).getTime() -
                  startDate.getTime()) /
                  (1000 * 60 * 60 * 24),
              ) /
                30)
          : 0;

      // Pontuação final
      const finalScore = dailyProgressRate + completionBonus;

      // Calcular velocidade média em km/h (duration já está em horas)
      const avgSpeed = totalDuration > 0 ? totalDistance / totalDuration : 0;

      return {
        userId: inscription.user.id,
        userName: inscription.user.name,
        userAvatar: inscription.user.UserData?.avatar_url || null,
        totalDistance,
        totalDuration,
        progress: Number(inscription.progress),
        progressPercent: parseFloat(progressPercent.toFixed(2)),
        daysSinceStart,
        dailyProgressRate: parseFloat(dailyProgressRate.toFixed(2)),
        avgSpeed: parseFloat(avgSpeed.toFixed(2)),
        completed: inscription.completed,
        completionBonus: parseFloat(completionBonus.toFixed(2)),
        finalScore: parseFloat(finalScore.toFixed(2)),
      };
    });

    // Ordenar por pontuação final (taxa de progresso + bônus de conclusão)
    const sortedRankings = rankings.sort((a, b) => b.finalScore - a.finalScore);

    // Adicionar posição no ranking
    const finalRankings = sortedRankings.map((user, index) => ({
      position: index + 1,
      ...user,
    }));

    return finalRankings;
  }
}
