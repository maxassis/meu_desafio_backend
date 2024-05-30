import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
// import { PrismaService } from 'src/infra/database/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountCreatedTemplate } from 'src/templates-email/account.created.template';
import { CreateUserSchemaDTO } from '../schemas/create-user-schema';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  async create(data: CreateUserSchemaDTO) {
    const user = await this.prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const password = await hash(data.password, 10);

    this.sendCreatedAccountEmail(data.name, data.email);

    return await this.prisma.users.create({
      data: {
        ...data,
        password,
      },
    });
  }

  async sendCreatedAccountEmail(name, email) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'bondis@meudesafio.com',
        subject: 'Cadastro realizado com sucesso',
        html: AccountCreatedTemplate(name),
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
