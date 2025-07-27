import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserTemplate } from 'src/templates-email/create.user.code.template';
import { RedisService } from '../../../infra/cache/redis/redis.service';

@Injectable()
export class SendMailUseCase {
  constructor(
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  async sendMail(name: string, email: string) {
    const nanoid = customAlphabet('0123456789', 6);
    const code = nanoid();

    try {
      await this.redisService.set(`code-${email}`, code, 'EX', 300);

      await this.mailerService.sendMail({
        to: email,
        from: 'bondis@meudesafio.com',
        subject: 'Confirme seu email',
        html: CreateUserTemplate(name, code),
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new InternalServerErrorException('Falha ao enviar email');
    }

    return { message: 'Email enviado com sucesso' };
  }
}
