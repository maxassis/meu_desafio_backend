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
      }
    >();

    for (const inscription of inscriptions) {
      const totalDistanceKm = inscription.tasks.reduce(
        (sum, task) => sum + Number(task.distanceKm || 0),
        0,
      );

      inscriptionsMap.set(inscription.desafioId, {
        completed: inscription.completed,
        completedAt: inscription.completedAt,
        progress: Number(inscription.progress),
        totalDistanceKm,
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
        progress: progressPercentage,
        totalDistanceKm,
      };
    });

    return desafiosComStatus;
  }
}
