import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RedisService } from 'src/infra/cache/redis/redis.service';

@Injectable()
export class GetPurchaseDataUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getPurchaseData(desafioId: string) {
    const cacheKey = `desafio:${desafioId}:purchaseData`;

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const desafio = await this.prisma.desafio.findUnique({
      where: { id: desafioId },
      select: { purchaseData: true },
    });

    if (!desafio) {
      throw new Error('Desafio não encontrado');
    }

    await this.redisService.set(
      cacheKey,
      JSON.stringify(desafio.purchaseData),
      'EX',
      3600,
    );

    return desafio.purchaseData;
  }
}
