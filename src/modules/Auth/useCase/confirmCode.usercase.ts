import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ConfirmCodeUseCase {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  async confirmCode(code: string, email: string) {
    const codeRedis = await this.redis.get(`code-${email}`);

    if (code !== codeRedis) {
      throw new HttpException('Codigo invalido', HttpStatus.UNAUTHORIZED);
    }

    return { message: `O codigo ${code}, esta correto` };
  }
}
