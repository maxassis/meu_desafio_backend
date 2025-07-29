import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RedisService } from 'src/infra/cache/redis/redis.service';

@Injectable()
export class GetUserTaskUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getTask(userId: string, inscriptionId: number) {
    const cacheKey = `user:${userId}:inscription:${inscriptionId}:tasks`;

    // 1. Tenta buscar do cache
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. Se não tem cache, busca do banco
    const tasks = await this.prisma.task.findMany({
      where: {
        usersId: userId,
        inscriptionId: inscriptionId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // 3. Salva no cache por 1 hora (3600 segundos)
    await this.redisService.set(cacheKey, JSON.stringify(tasks));
    await this.redisService.expire(cacheKey, 3600);

    return tasks;
  }
}
