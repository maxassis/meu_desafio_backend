
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
      },
    });

    const participacoes = await this.prisma.participation.findMany({
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

    const participacoesMap = new Map(
      participacoes.map((p) => [p.desafioId, p]),
    );

    const desafiosComStatus = desafios.map((desafio) => {
      const participacao = participacoesMap.get(desafio.id);

      let progressPercentage = 0;
      if (participacao) {
        const progressValue = Number(participacao.progress);
        const distanceValue = Number(desafio.distance);

        progressPercentage =
          distanceValue > 0
            ? Math.min(100, (progressValue / distanceValue) * 100)
            : 0;
      }

      return {
        ...desafio,
        isRegistered: !!participacao,
        completed: participacao?.completed || false,
        completedAt: participacao?.completedAt || null,
        progress: progressPercentage,
      };
    });

    return desafiosComStatus;
  }
}
