import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetAllDesafioUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDesafio(userId: string) {
    // Get all challenges
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
      where: {
        userId,
      },
      select: {
        desafioId: true,
        completed: true,
        completedAt: true,
        progress: true,
      },
    });

    const inscriptionsMap = new Map(inscriptions.map((p) => [p.desafioId, p]));

    const desafiosComStatus = desafios.map((desafio) => {
      const inscription = inscriptionsMap.get(desafio.id);

      let progressPercentage = 0;
      if (inscription) {
        const progressValue = Number(inscription.progress);
        const distanceValue = Number(desafio.distance);

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
      };
    });

    return desafiosComStatus;
  }
}
