// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/infra/database/prisma.service';

// @Injectable()
// export class GetRankingUseCase {
//   constructor(private readonly prisma: PrismaService) {}

//   async getRanking(desafioId: string) {
//     const desafio = await this.prisma.desafio.findUnique({
//       where: {
//         id: +desafioId,
//       },
//     });

//     if (!desafio) {
//       throw new Error(`Desafio com ID ${desafioId} não encontrado`);
//     }

//     const inscriptions = await this.prisma.inscription.findMany({
//       where: {
//         desafioId: +desafioId,
//       },
//       include: {
//         user: {
//           include: {
//             UserData: true,
//           },
//         },
//         tasks: {
//           orderBy: {
//             date: 'asc',
//           },
//           select: {
//             distanceKm: true,
//             duration: true,
//             date: true,
//             createdAt: true,
//           },
//         },
//       },
//     });

//     const now = new Date();
//     const rankings = inscriptions.map((inscription) => {
//       const totalDistance = inscription.tasks.reduce(
//         (sum, task) => sum + Number(task.distanceKm),
//         0,
//       );

//       // Duration converted to seconds
//       const totalDurationSeconds = inscription.tasks.reduce(
//         (sum, task) => sum + Number(task.duration) * 3600,
//         0,
//       );

//       let startDate = new Date();
//       if (inscription.tasks.length > 0) {
//         const firstTask = inscription.tasks[0];
//         startDate = new Date(firstTask.date || firstTask.createdAt || now);
//       }

//       const daysSinceStart = Math.max(
//         1,
//         Math.ceil(
//           (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
//         ),
//       );

//       const progressPercent =
//         (Number(inscription.progress) / Number(desafio.distance)) * 100;
//       const dailyProgressRate = progressPercent / daysSinceStart;

//       const completionBonus =
//         inscription.completed && inscription.completedAt
//           ? 100 *
//             (1 -
//               Math.ceil(
//                 (new Date(inscription.completedAt).getTime() -
//                   startDate.getTime()) /
//                   (1000 * 60 * 60 * 24),
//               ) /
//                 30)
//           : 0;

//       const finalScore = dailyProgressRate + completionBonus;

//       // Average speed calculation using duration in seconds
//       const avgSpeed =
//         totalDurationSeconds > 0
//           ? totalDistance / (totalDurationSeconds / 3600)
//           : 0;

//       return {
//         userId: inscription.user.id,
//         userName: inscription.user.name,
//         userAvatar: inscription.user.UserData?.avatar_url || null,
//         totalDistance,
//         totalDurationSeconds, // Duration explicitly in seconds
//         progress: Number(inscription.progress),
//         progressPercent: parseFloat(progressPercent.toFixed(2)),
//         daysSinceStart,
//         dailyProgressRate: parseFloat(dailyProgressRate.toFixed(2)),
//         avgSpeed: parseFloat(avgSpeed.toFixed(2)),
//         completed: inscription.completed,
//         completionBonus: parseFloat(completionBonus.toFixed(2)),
//         finalScore: parseFloat(finalScore.toFixed(2)),
//       };
//     });

//     const sortedRankings = rankings.sort((a, b) => b.finalScore - a.finalScore);
//     const finalRankings = sortedRankings.map((user, index) => ({
//       position: index + 1,
//       ...user,
//     }));

//     return finalRankings;
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetRankingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getRanking(desafioId: string) {
    const desafio = await this.prisma.desafio.findUnique({
      where: {
        id: +desafioId,
      },
    });

    if (!desafio) {
      throw new Error(`Desafio com ID ${desafioId} não encontrado`);
    }

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
    const rankings = inscriptions.map((inscription) => {
      const totalDistance = inscription.tasks.reduce(
        (sum, task) => sum + Number(task.distanceKm),
        0,
      );

      // Duration is already in seconds, no conversion needed
      const totalDurationSeconds = inscription.tasks.reduce(
        (sum, task) => sum + Number(task.duration),
        0,
      );

      let startDate = new Date();
      if (inscription.tasks.length > 0) {
        const firstTask = inscription.tasks[0];
        startDate = new Date(firstTask.date || firstTask.createdAt || now);
      }

      const daysSinceStart = Math.max(
        1,
        Math.ceil(
          (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        ),
      );

      const progressPercent =
        (Number(inscription.progress) / Number(desafio.distance)) * 100;
      const dailyProgressRate = progressPercent / daysSinceStart;

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

      const finalScore = dailyProgressRate + completionBonus;

      // Average speed calculation (km/h) - convert seconds to hours
      const avgSpeed =
        totalDurationSeconds > 0
          ? totalDistance / (totalDurationSeconds / 3600)
          : 0;

      return {
        userId: inscription.user.id,
        userName: inscription.user.name,
        userAvatar: inscription.user.UserData?.avatar_url || null,
        totalDistance,
        totalDurationSeconds, // Duration in seconds
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

    const sortedRankings = rankings.sort((a, b) => b.finalScore - a.finalScore);
    const finalRankings = sortedRankings.map((user, index) => ({
      position: index + 1,
      ...user,
    }));

    return finalRankings;
  }
}
