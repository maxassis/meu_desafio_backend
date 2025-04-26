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
//       },
//     });

//     const participacoesCompletas = await this.prisma.participation.findMany({
//       where: {
//         userId,
//         completed: true,
//       },
//       select: {
//         desafioId: true,
//         completedAt: true,
//       },
//     });

//     const completadosMap = new Map(
//       participacoesCompletas.map((p) => [p.desafioId, p.completedAt]),
//     );

//     const desafiosMarcados = desafios.map((desafio) => ({
//       ...desafio,
//       isActive: completadosMap.has(desafio.id),
//       completed: completadosMap.has(desafio.id),
//       completedAt: completadosMap.get(desafio.id) ?? null,
//     }));

//     return desafiosMarcados;
//   }
// }

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

    // Find all user's participations (both completed and in-progress)
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

    // Create maps for completed challenges and all participations
    const participacoesMap = new Map(
      participacoes.map((p) => [p.desafioId, p]),
    );

    // Map the challenges with participation status
    const desafiosComStatus = desafios.map((desafio) => {
      const participacao = participacoesMap.get(desafio.id);

      return {
        ...desafio,
        isRegistered: !!participacao, // true if user is registered for this challenge
        completed: participacao?.completed || false,
        completedAt: participacao?.completedAt || null,
        progress: participacao?.progress || 0,
      };
    });

    return desafiosComStatus;
  }
}
