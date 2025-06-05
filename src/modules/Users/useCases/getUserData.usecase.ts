// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/infra/database/prisma.service';

// @Injectable()
// export class GetUserDataUseCase {
//   constructor(private readonly prisma: PrismaService) {}

//   async getUserData(id: string, name: string) {
//     const user = await this.prisma.userData.findUnique({
//       where: {
//         usersId: id,
//       },
//     });

//     return {
//       ...user,
//       username: name,
//     };
//   }
// }

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

    // 1. Tenta pegar do cache
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...parsed, username: name };
    }

    // 2. Busca no banco
    const user = await this.prisma.userData.findUnique({
      where: {
        usersId: id,
      },
    });

    const result = {
      ...user,
      username: name,
    };

    // 3. Salva no cache (exceto username pois pode ser variável)
    await this.redisService.set(cacheKey, JSON.stringify(user), 'EX', 3600);

    return result;
  }
}
