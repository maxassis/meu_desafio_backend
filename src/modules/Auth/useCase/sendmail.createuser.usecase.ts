import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { MailerService } from '@nestjs-modules/mailer';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { CreateUserTermplate } from 'src/templates-email/create.user.template';

@Injectable()
export class SendMailUseCase {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly mailerService: MailerService,
  ) {}

  async sendMail(name: string, email: string) {
    console.log(name, email);

    const nanoid = customAlphabet('0123456789', 6);
    const code = nanoid();
    console.log(code);

    try {
      await this.redis.set(`code-${email}`, code, 'EX', 300);
      await this.mailerService.sendMail({
        to: email,
        from: 'bondis@meudesafio.com',
        subject: 'Confirme seu email',
        html: CreateUserTermplate(name, code),
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return { message: 'Email enviado com sucesso' };
  }
}
