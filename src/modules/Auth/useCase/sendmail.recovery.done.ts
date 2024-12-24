import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class SendMailRecoveryDoneUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    @InjectQueue('emailRecoveryDone-queue') private queue: Queue,
  ) {}

  async sendMailDone(email: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    try {
      await this.queue.add('emailRecoveryDone-queue', {
        email,
        name: user.name,
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return { message: 'Email enfileirado com sucesso' };
  }
}
