import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ConfirmCodeUseCase {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async confirmCode(code: string, email: string) {
    const codeRedis = await this.redis.get(`code-${email}`);

    if (code !== codeRedis) {
      throw new HttpException('Codigo invalido', HttpStatus.UNAUTHORIZED);
    }

    return { message: `O codigo ${code}, esta correto` };
  }
}
