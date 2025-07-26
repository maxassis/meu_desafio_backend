import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RedisService } from 'src/infra/cache/redis/redis.service';

@Injectable()
export class GetUserDataUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getUserData(id: string, name: string) {
    const cacheKey = `user:${id}:data`;

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...parsed, username: name };
    }

    const user = await this.prisma.userData.findUnique({
      where: {
        usersId: id,
      },
    });

    const result = {
      ...user,
      username: name,
    };

    await this.redisService.set(cacheKey, JSON.stringify(user), 'EX', 3600);

    return result;
  }
}
