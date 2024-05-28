import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountCreatedTemplate } from 'src/templates-email/account.created.template';

@Injectable()
export class SendMailRecoveryDoneUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
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
      await this.mailerService.sendMail({
        to: email,
        from: 'bondis@meudesafio.com',
        subject: 'Sua senha foi cadastrada com sucesso',
        html: AccountCreatedTemplate(user.name),
      });
    } catch {
      throw new InternalServerErrorException();
    }

    return { message: 'Email enviado com sucesso' };
  }
}
