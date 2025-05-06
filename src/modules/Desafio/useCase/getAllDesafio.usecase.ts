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
//         desafioId: true,
//         completed: true,
//         completedAt: true,
//         progress: true,
//         tasks: {
//           select: {
//             distanceKm: true,
//             duration: true, // Added duration to select
//             id: true, // Added id to count tasks
//           },
//         },
//       },
//     });

//     // Cria um Map com soma de distanceKm para cada desafio
//     const inscriptionsMap = new Map<
//       number,
//       {
//         completed: boolean;
//         completedAt: Date | null;
//         progress: number;
//         totalDistanceKm: number;
//         tasksCount: number; // Added task count
//         totalDuration: number; // Added total duration
//       }
//     >();

//     // Calculate total tasks and total duration across all inscriptions
//     let totalTasksCount = 0;
//     let totalDuration = 0;

//     for (const inscription of inscriptions) {
//       const totalDistanceKm = inscription.tasks.reduce(
//         (sum, task) => sum + Number(task.distanceKm || 0),
//         0,
//       );

//       // Count tasks for this inscription
//       const tasksCount = inscription.tasks.length;
//       totalTasksCount += tasksCount;

//       // Sum durations for this inscription
//       const inscriptionTotalDuration = inscription.tasks.reduce(
//         (sum, task) => sum + Number(task.duration || 0),
//         0,
//       );
//       totalDuration += inscriptionTotalDuration;

//       inscriptionsMap.set(inscription.desafioId, {
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
//         totalDistanceKm = inscription.totalDistanceKm;

//         progressPercentage =
//           distanceValue > 0
//             ? Math.min(100, (progressValue / distanceValue) * 100)
//             : 0;
//       }

//       return {
//         ...desafio,
//         isRegistered: !!inscription,
//         completed: inscription?.completed || false,
//         completedAt: inscription?.completedAt || null,
//         progressPercentage: progressPercentage,
//         totalDistanceCompleted: totalDistanceKm,
//         tasksCount: inscription?.tasksCount || 0,
//         totalDuration: inscription?.totalDuration || 0,
//       };
//     });

//     // Return desafios with status and overall statistics in a single object
//     return {
//       desafios: desafiosComStatus,
//       totalTasksCount,
//       totalDuration,
//     };
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetAllDesafioUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDesafio(userId: string) {
    const desafios = await this.prisma.desafio.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        distance: true,
        photo: true,
      },
    });

    const inscriptions = await this.prisma.inscription.findMany({
      where: { userId },
      select: {
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

    // Cria um Map com soma de distanceKm para cada desafio
    const inscriptionsMap = new Map<
      number,
      {
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

      // Count tasks for this inscription
      const tasksCount = inscription.tasks.length;

      // Sum durations for this inscription
      const inscriptionTotalDuration = inscription.tasks.reduce(
        (sum, task) => sum + Number(task.duration || 0),
        0,
      );

      inscriptionsMap.set(inscription.desafioId, {
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
        totalDistanceKm = inscription.totalDistanceKm;

        progressPercentage =
          distanceValue > 0
            ? Math.min(100, (progressValue / distanceValue) * 100)
            : 0;
      }

      return {
        ...desafio,
        isRegistered: !!inscription,
        completed: inscription?.completed || false,
        completedAt: inscription?.completedAt || null,
        progressPercentage: progressPercentage,
        totalDistanceCompleted: totalDistanceKm,
        tasksCount: inscription?.tasksCount || 0,
        totalDuration: inscription?.totalDuration || 0,
      };
    });

    // Return only the desafios array
    return desafiosComStatus;
  }
}
