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
      where: { id: +idDesafio },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        distance: true,
        photo: true,
        inscription: {
          where: { completed: false },
          select: {
            progress: true,
            user: {
              select: {
                id: true,
                name: true,
                UserData: { select: { avatar_url: true } },
              },
            },
            _count: { select: { tasks: true } },
            tasks: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { createdAt: true },
            },
          },
        },
      },
    });

    if (!desafio) {
      throw new NotFoundException(`Desafio with ID ${idDesafio} not found`);
    }

    const inscriptionsWithStats = desafio.inscription.map((inscription) => {
      const lastTaskDate = inscription.tasks[0]?.createdAt ?? null;

      return {
        user: inscription.user,
        progress: inscription.progress,
        totalTasks: inscription._count.tasks,
        totalCalories: 0,
        totalDistanceKm: 0,
        lastTaskDate,
      };
    });

    const result = {
      id: desafio.id,
      name: desafio.name,
      description: desafio.description,
      location: desafio.location,
      distance: desafio.distance,
      photo: desafio.photo,
      inscription: inscriptionsWithStats,
    };

    // Define no cache com TTL de 5 minutos (300 segundos)
    // await this.redisService.set(cacheKey, JSON.stringify(result), 'EX', 300);
    await this.redisService.set(cacheKey, JSON.stringify(result), 'EX', 900); // 15 min

    return result;
  }
}
