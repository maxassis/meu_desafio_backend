import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetRankingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getRanking(desafioId: string) {
    // Obter todas as participações para este desafio com seus usuários e tarefas
    const participations = await this.prisma.participation.findMany({
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
          select: {
            distanceKm: true,
            duration: true,
          },
        },
      },
    });

    // Processar os dados para obter os valores agregados e calcular velocidade média
    const rankings = participations.map((participation) => {
      const totalDistance = participation.tasks.reduce(
        (sum, task) => sum + Number(task.distanceKm),
        0,
      );

      const totalDuration = participation.tasks.reduce(
        (sum, task) => sum + Number(task.duration),
        0,
      );

      // Calcular velocidade média em km/h (duration já está em horas)
      const avgSpeed = totalDuration > 0 ? totalDistance / totalDuration : 0;

      return {
        userId: participation.user.id,
        userName: participation.user.name,
        userAvatar: participation.user.UserData?.avatar_url || null,
        totalDistance,
        totalDuration,
        avgSpeed: parseFloat(avgSpeed.toFixed(2)),
      };
    });

    // Ordenar por velocidade média
    const sortedRankings = rankings.sort((a, b) => b.avgSpeed - a.avgSpeed);

    // Adicionar posição no ranking
    const finalRankings = sortedRankings.map((user, index) => ({
      position: index + 1,
      ...user,
    }));

    return finalRankings;
  }

  // async getRanking(desafioId: string) {
  //   // Obter todas as participações para este desafio com seus usuários e tarefas
  //   const participations = await this.prisma.participation.findMany({
  //     where: {
  //       desafioId: +desafioId,
  //     },
  //     include: {
  //       user: {
  //         include: {
  //           UserData: true,
  //         },
  //       },
  //       tasks: {
  //         select: {
  //           distanceKm: true,
  //           duration: true,
  //         },
  //       },
  //     },
  //   });

  //   // Processar os dados para obter os valores agregados
  //   const rankings = participations.map((participation) => {
  //     const totalDistance = participation.tasks.reduce(
  //       (sum, task) => sum + Number(task.distanceKm),
  //       0,
  //     );

  //     const totalDuration = participation.tasks.reduce(
  //       (sum, task) => sum + Number(task.duration),
  //       0,
  //     );

  //     return {
  //       userId: participation.user.id,
  //       userName: participation.user.name,
  //       userAvatar: participation.user.UserData?.avatar_url || null,
  //       totalDistance,
  //       totalDuration,
  //     };
  //   });

  //   // Ordenar por distância total
  //   return rankings.sort((a, b) => b.totalDistance - a.totalDistance);
  // }
}
