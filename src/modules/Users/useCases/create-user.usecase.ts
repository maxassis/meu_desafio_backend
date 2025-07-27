import {
  HttpException,
  HttpStatus,
  Injectable,
  // InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AccountCreatedTemplate } from 'src/templates-email/account.created.template';
import { CreateUserSchemaDTO } from '../schemas/create-user-schema';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: CreateUserSchemaDTO) {
    const existingUser = await this.prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hash(data.password, 10);

    // Criação do usuário
    const newUser = await this.prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        UserData: {
          create: {
            createdAt: new Date(),
          },
        },
      },
      include: {
        UserData: true,
      },
    });

    // Envio de email de forma assíncrona
    this.sendCreatedAccountEmail(data.name, data.email).catch((error) => {
      console.error('Error sending welcome email:', error);
    });

    return newUser;
  }

  private async sendCreatedAccountEmail(name: string, email: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'bondis@meudesafio.com',
        subject: 'Cadastro realizado com sucesso',
        html: AccountCreatedTemplate(name),
      });
    } catch (error) {
      // Apenas loga o erro sem lançar exceção, já que é assíncrono
      console.error('Failed to send welcome email:', error);
    }
  }
}

// import {
//   HttpException,
//   HttpStatus,
//   Injectable,
//   // InternalServerErrorException,
// } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';
// import { hash } from 'bcrypt';
// import { PrismaService } from 'src/infra/database/prisma.service';
// import { AccountCreatedTemplate } from 'src/templates-email/account.created.template';
// import { CreateUserSchemaDTO } from '../schemas/create-user-schema';
// import { ConfigService } from '@nestjs/config';
// import { Env } from 'src/env';

// @Injectable()
// export class CreateUserUseCase {
//   constructor(
//     private readonly mailerService: MailerService,
//     private readonly prisma: PrismaService,
//     private configService: ConfigService<Env, true>,
//   ) {}

//   async create(data: CreateUserSchemaDTO) {
//     const existingUser = await this.prisma.users.findFirst({
//       where: {
//         email: data.email,
//       },
//     });

//     if (existingUser) {
//       throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
//     }

//     const hashedPassword = await hash(data.password, 10);

//     // Criação do usuário
//     const newUser = await this.prisma.users.create({
//       data: {
//         name: data.name,
//         email: data.email,
//         password: hashedPassword,
//         UserData: {
//           create: {
//             createdAt: new Date(),
//           },
//         },
//       },
//       include: {
//         UserData: true,
//       },
//     });

//     // Envio de email de forma assíncrona
//     this.sendCreatedAccountEmail(data.name, data.email).catch((error) => {
//       console.error('Error sending welcome email:', error);
//     });

//     return newUser;
//   }

//   private async sendCreatedAccountEmail(name: string, email: string) {
//     try {
//       await this.mailerService.sendMail({
//         to: email,
//         from: `"Meu Desafio" <${this.configService.get('GMAIL_USER')}>`, // Usando seu Gmail
//         subject: 'Cadastro realizado com sucesso',
//         html: AccountCreatedTemplate(name),
//       });
//     } catch (error) {
//       // Apenas loga o erro sem lançar exceção, já que é assíncrono
//       console.error('Failed to send welcome email:', error);
//     }
//   }
// }
