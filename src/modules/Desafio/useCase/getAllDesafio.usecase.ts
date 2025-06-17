// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/infra/database/prisma.service';

// @Injectable()
// export class GetAllDesafioUseCase {
//   constructor(private readonly prisma: PrismaService) {}

//   async getAllDesafio(userId: string) {
//     const desafios = await this.prisma.desafio.findMany({
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         distance: true,
//         photo: true,
//       },
//     });

//     const inscriptions = await this.prisma.inscription.findMany({
//       where: { userId },
//       select: {
//         id: true,
//         desafioId: true,
//         completed: true,
//         completedAt: true,
//         progress: true,
//         tasks: {
//           select: {
//             distanceKm: true,
//             duration: true,
//             id: true,
//           },
//         },
//       },
//     });

//     const inscriptionsMap = new Map<
//       number,
//       {
//         inscriptionId: number;
//         completed: boolean;
//         completedAt: Date | null;
//         progress: number;
//         totalDistanceKm: number;
//         tasksCount: number;
//         totalDuration: number;
//       }
//     >();

//     for (const inscription of inscriptions) {
//       const totalDistanceKm = inscription.tasks.reduce(
//         (sum, task) => sum + Number(task.distanceKm || 0),
//         0,
//       );

//       const tasksCount = inscription.tasks.length;
//       const inscriptionTotalDuration = inscription.tasks.reduce(
//         (sum, task) => sum + Number(task.duration || 0),
//         0,
//       );

//       inscriptionsMap.set(inscription.desafioId, {
//         inscriptionId: inscription.id,
//         completed: inscription.completed,
//         completedAt: inscription.completedAt,
//         progress: Number(inscription.progress),
//         totalDistanceKm,
//         tasksCount,
//         totalDuration: inscriptionTotalDuration,
//       });
//     }

//     const desafiosComStatus = desafios.map((desafio) => {
//       const inscription = inscriptionsMap.get(desafio.id);

//       let progressPercentage = 0;
//       let totalDistanceKm = 0;

//       if (inscription) {
//         const progressValue = inscription.progress;
//         const distanceValue = Number(desafio.distance);

//         if (inscription.completed) {
//           totalDistanceKm = distanceValue;
//         } else {
//           totalDistanceKm = inscription.totalDistanceKm;
//         }

//         progressPercentage =
//           distanceValue > 0
//             ? Math.min(100, (progressValue / distanceValue) * 100)
//             : 0;
//       }

//       return {
//         ...desafio,
//         isRegistered: !!inscription,
//         inscriptionId: inscription?.inscriptionId || null,
//         completed: inscription?.completed || false,
//         completedAt: inscription?.completedAt || null,
//         progressPercentage: progressPercentage,
//         totalDistanceCompleted: totalDistanceKm,
//         tasksCount: inscription?.tasksCount || 0,
//         totalDuration: inscription?.totalDuration || 0,
//       };
//     });

//     return desafiosComStatus;
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RedisService } from '../../../infra/cache/redis/redis.service';

@Injectable()
export class GetAllDesafioUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getAllDesafio(userId: string) {
    const cacheKey = `user:${userId}:desafios`;

    // Tenta buscar no cache
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Caso não tenha cache, busca no banco
    const desafios = await this.prisma.desafio.findMany({
      select: {
        id: true,
        name: true,
        distance: true,
        photo: true,
      },
    });

    const inscriptions = await this.prisma.inscription.findMany({
      where: { userId },
      select: {
        id: true,
        desafioId: true,
        completed: true,
        completedAt: true,
        progress: true,
        tasks: {
          select: {
            distanceKm: true,
            duration: true,
            id: true,
          },
        },
      },
    });

    const inscriptionsMap = new Map<
      number,
      {
        inscriptionId: number;
        completed: boolean;
        completedAt: Date | null;
        progress: number;
        totalDistanceKm: number;
        tasksCount: number;
        totalDuration: number;
      }
    >();

    for (const inscription of inscriptions) {
      const totalDistanceKm = inscription.tasks.reduce(
        (sum, task) => sum + Number(task.distanceKm || 0),
        0,
      );

      const tasksCount = inscription.tasks.length;
      const inscriptionTotalDuration = inscription.tasks.reduce(
        (sum, task) => sum + Number(task.duration || 0),
        0,
      );

      inscriptionsMap.set(inscription.desafioId, {
        inscriptionId: inscription.id,
        completed: inscription.completed,
        completedAt: inscription.completedAt,
        progress: Number(inscription.progress),
        totalDistanceKm,
        tasksCount,
        totalDuration: inscriptionTotalDuration,
      });
    }

    const desafiosComStatus = desafios.map((desafio) => {
      const inscription = inscriptionsMap.get(desafio.id);

      let progressPercentage = 0;
      let totalDistanceKm = 0;

      if (inscription) {
        const progressValue = inscription.progress;
        const distanceValue = Number(desafio.distance);

        if (inscription.completed) {
          totalDistanceKm = distanceValue;
        } else {
          totalDistanceKm = inscription.totalDistanceKm;
        }

        progressPercentage =
          distanceValue > 0
            ? Math.min(100, (progressValue / distanceValue) * 100)
            : 0;
      }

      return {
        ...desafio,
        isRegistered: !!inscription,
        inscriptionId: inscription?.inscriptionId || null,
        completed: inscription?.completed || false,
        completedAt: inscription?.completedAt || null,
        progressPercentage: progressPercentage,
        totalDistanceCompleted: totalDistanceKm,
        tasksCount: inscription?.tasksCount || 0,
        totalDuration: inscription?.totalDuration || 0,
      };
    });

    // Salva no cache com TTL de 1 hora
    await this.redisService.set(
      cacheKey,
      JSON.stringify(desafiosComStatus),
      'EX',
      3600,
    );

    return desafiosComStatus;
  }
}
