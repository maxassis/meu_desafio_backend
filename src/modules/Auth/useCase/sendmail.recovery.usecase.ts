import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RedisService } from '../../../infra/cache/redis/redis.service';
import { AccountRecoveryCodeTemplate } from 'src/templates-email/account.recovery.code.template';

@Injectable()
export class SendMailRecoveryUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

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
      await this.redisService.set(`code-${email}`, code, 'EX', 300);

      await this.mailerService.sendMail({
        to: email,
        from: 'bondis@meudesafio.com',
        subject: 'Confirme seu email',
        html: AccountRecoveryCodeTemplate(user.name, code),
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return { message: 'Email enviado com sucesso' };
  }
}
