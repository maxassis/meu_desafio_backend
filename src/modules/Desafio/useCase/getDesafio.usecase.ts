// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/infra/database/prisma.service';
// import { RedisService } from '../../../infra/cache/redis/redis.service';

// @Injectable()
// export class GetDesafioUseCase {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly redisService: RedisService,
//   ) {}

//   async getDesafio(idDesafio: string) {
//     const cacheKey = `desafio:${idDesafio}`;

//     // Tenta obter do cache
//     const cachedDesafio = await this.redisService.get(cacheKey);
//     if (cachedDesafio) {
//       return JSON.parse(cachedDesafio);
//     }

//     const desafio = await this.prisma.desafio.findUnique({
//       where: { id: idDesafio },
//       select: {
//         id: true,
//         name: true,
//         location: true,
//         distance: true,
//         photo: true,
//         inscription: {
//           where: { completed: false },
//           select: {
//             progress: true,
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 UserData: { select: { avatar_url: true } },
//               },
//             },
//             _count: { select: { tasks: true } },
//             tasks: {
//               orderBy: { createdAt: 'desc' },
//               take: 1,
//               select: { createdAt: true },
//             },
//           },
//         },
//       },
//     });

//     if (!desafio) {
//       throw new NotFoundException(`Desafio with ID ${idDesafio} not found`);
//     }

//     const inscriptionsWithStats = desafio.inscription.map((inscription) => {
//       const lastTaskDate = inscription.tasks[0]?.createdAt ?? null;

//       return {
//         user: inscription.user,
//         progress: inscription.progress,
//         totalTasks: inscription._count.tasks,
//         totalCalories: 0,
//         totalDistanceKm: 0,
//         lastTaskDate,
//       };
//     });

//     const result = {
//       id: desafio.id,
//       name: desafio.name,
//       location: desafio.location,
//       distance: desafio.distance,
//       photo: desafio.photo,
//       inscription: inscriptionsWithStats,
//     };

//     // Define no cache com TTL de 5 minutos (300 segundos)
//     // await this.redisService.set(cacheKey, JSON.stringify(result), 'EX', 900); // 15 min
//     await this.redisService.set(cacheKey, JSON.stringify(result), 'EX', 300);

//     return result;
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RedisService } from '../../../infra/cache/redis/redis.service';

@Injectable()
export class GetDesafioUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getDesafio(idDesafio: string) {
    const cacheKey = `desafio:${idDesafio}`;

    // Tenta obter do cache
    const cachedDesafio = await this.redisService.get(cacheKey);
    if (cachedDesafio) {
      return JSON.parse(cachedDesafio);
    }

    const desafio = await this.prisma.desafio.findUnique({
      where: { id: idDesafio },
      select: {
        id: true,
        name: true,
        location: true,
        distance: true,
        photo: true,
        inscription: {
          where: { completed: false },
          select: {
            id: true,
            progress: true,
            user: {
              select: {
                id: true,
                name: true,
                UserData: { select: { avatar_url: true } },
              },
            },
          },
        },
      },
    });

    if (!desafio) {
      throw new NotFoundException(`Desafio with ID ${idDesafio} not found`);
    }

    // Busca estatísticas para cada inscrição
    const inscriptionsWithStats = await Promise.all(
      desafio.inscription.map(async (inscription) => {
        // Busca todas as tasks desta inscrição específica
        const tasks = await this.prisma.task.findMany({
          where: {
            inscriptionId: inscription.id,
          },
          select: {
            createdAt: true,
            calories: true,
            distanceKm: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        const lastTaskDate = tasks.length > 0 ? tasks[0].createdAt : null;

        const totalCalories = tasks.reduce((sum, task) => {
          return sum + (task.calories || 0);
        }, 0);

        const totalDistanceKm = tasks.reduce((sum, task) => {
          return sum + (Number(task.distanceKm) || 0);
        }, 0);

        return {
          user: inscription.user,
          progress: inscription.progress,
          totalTasks: tasks.length,
          totalCalories,
          totalDistanceKm,
          lastTaskDate,
        };
      }),
    );

    const result = {
      id: desafio.id,
      name: desafio.name,
      location: desafio.location,
      distance: desafio.distance,
      photo: desafio.photo,
      inscription: inscriptionsWithStats,
    };

    // Define no cache com TTL de 5 minutos (300 segundos)
    await this.redisService.set(cacheKey, JSON.stringify(result), 'EX', 300);

    return result;
  }
}
