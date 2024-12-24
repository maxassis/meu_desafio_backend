import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { MailerService } from '@nestjs-modules/mailer';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class SendMailUseCase {
  private readonly redis: Redis;

  constructor(
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
    @InjectQueue('email-queue') private queue: Queue,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async sendMail(name: string, email: string) {
    const nanoid = customAlphabet('0123456789', 6);
    const code = nanoid();

    try {
      await this.redis.set(`code-${email}`, code, 'EX', 300);
      await this.queue.add('email-job', { email, name, code });
    } catch {
      throw new InternalServerErrorException();
    }

    return { message: 'Email enfileirado com sucesso' };
  }
}
