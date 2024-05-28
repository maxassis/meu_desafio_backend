import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { MailerService } from '@nestjs-modules/mailer';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { CreateUserTemplate } from 'src/templates-email/create.user.code.template';

@Injectable()
export class SendMailUseCase {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly mailerService: MailerService,
  ) {}

  async sendMail(name: string, email: string) {
    const nanoid = customAlphabet('0123456789', 6);
    const code = nanoid();

    try {
      await this.redis.set(`code-${email}`, code, 'EX', 300);
      await this.mailerService.sendMail({
        to: email,
        from: 'bondis@meudesafio.com',
        subject: 'Confirme seu email',
        html: CreateUserTemplate(name, code),
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return { message: 'Email enviado com sucesso' };
  }
}
