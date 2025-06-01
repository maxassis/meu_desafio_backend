// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/infra/database/prisma.service';

// @Injectable()
// export class GetUserDesafioUseCase {
//   constructor(private readonly prisma: PrismaService) {}

//   async getDesafio(userId: string) {
//     const inscricoes = await this.prisma.inscription.findMany({
//       where: { userId: userId },
//       include: {
//         desafio: {
//           select: {
//             name: true,
//             description: true,
//             distance: true,
//             photo: true,
//           },
//         },
//       },
//     });

//     const desafios = inscricoes.map((inscricao) => ({
//       ...inscricao.desafio,
//       isRegistered: true,
//       completed: inscricao.completed,
//     }));

//     return desafios;
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RedisService } from 'src/infra/cache/redis/redis.service';

@Injectable()
export class GetUserDesafioUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getDesafio(userId: string) {
    const cacheKey = `user:${userId}:my-desafios`;

    // 1. Tenta pegar do cache
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. Se não tiver cache, busca no banco
    const inscricoes = await this.prisma.inscription.findMany({
      where: { userId: userId },
      include: {
        desafio: {
          select: {
            name: true,
            description: true,
            distance: true,
            photo: true,
          },
        },
      },
    });

    const desafios = inscricoes.map((inscricao) => ({
      ...inscricao.desafio,
      isRegistered: true,
      completed: inscricao.completed,
    }));

    // 3. Salva no cache com TTL de 1 hora (3600 segundos)
    await this.redisService.set(cacheKey, JSON.stringify(desafios), 'EX', 3600);

    return desafios;
  }
}
