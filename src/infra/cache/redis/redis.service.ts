import { OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

export class RedisService extends Redis implements OnModuleDestroy {
  constructor() {
    super({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  }

  onModuleDestroy() {
    return this.disconnect();
  }
}
