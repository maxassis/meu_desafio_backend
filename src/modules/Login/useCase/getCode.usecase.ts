import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infra/database/redis.service';
import { customAlphabet } from 'nanoid';

@Injectable()
export class GetCodeUseCase {
  constructor(private redis: RedisService) {}

  async execute() {
    const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);
    const code = nanoid();

    await this.redis.set('code', code);
    return code;
  }
}
