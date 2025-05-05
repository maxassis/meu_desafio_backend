import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from '../../../infra/cache/redis/redis.service';

@Injectable()
export class ConfirmCodeUseCase {
  constructor(private readonly redisService: RedisService) {}

  async confirmCode(code: string, email: string) {
    const redisKey = `code-${email}`;

    const codeRedis = await this.redisService.get(redisKey);

    if (!codeRedis) {
      throw new HttpException(
        'Código expirado ou não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (code.trim() !== codeRedis.trim()) {
      throw new HttpException('Código inválido', HttpStatus.UNAUTHORIZED);
    }

    await this.redisService.del(redisKey);

    return { message: `Código ${code} está correto!` };
  }
}
