import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { MailerService } from '@nestjs-modules/mailer';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class SendMailRecoveryUseCase {
  private readonly redis: Redis;
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
    @InjectQueue('emailRecovery-queue') private queue: Queue,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async sendMailRecovery(email: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const nanoid = customAlphabet('0123456789', 6);
    const code = nanoid();

    try {
      await this.redis.set(`code-${email}`, code, 'EX', 300);
      await this.queue.add('emailRecovery-job', {
        name: user.name,
        email,
        code,
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return { message: 'Email enfileirado com sucesso 2' };
  }
}
