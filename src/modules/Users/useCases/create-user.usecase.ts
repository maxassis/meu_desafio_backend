// import {
//   HttpException,
//   HttpStatus,
//   Injectable,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';
// import { hash } from 'bcrypt';
// import { PrismaService } from 'src/infra/database/prisma.service';
// import { AccountCreatedTemplate } from 'src/templates-email/account.created.template';
// import { CreateUserSchemaDTO } from '../schemas/create-user-schema';

// @Injectable()
// export class CreateUserUseCase {
//   constructor(
//     private mailerService: MailerService,
//     private prisma: PrismaService,
//   ) {}

//   async create(data: CreateUserSchemaDTO) {
//     const user = await this.prisma.users.findFirst({
//       where: {
//         email: data.email,
//       },
//     });

//     if (user) {
//       throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
//     }

//     const password = await hash(data.password, 10);

//     this.sendCreatedAccountEmail(data.name, data.email);

//     return await this.prisma.users.create({
//       data: {
//         ...data,
//         password,
//         UserData: {
//           create: {
//             full_name: '',
//           },
//         },
//       },
//       // include: {
//       //   UserData: true,
//       // },
//     });
//   }

//   async sendCreatedAccountEmail(name, email) {
//     try {
//       await this.mailerService.sendMail({
//         to: email,
//         from: 'bondis@meudesafio.com',
//         subject: 'Cadastro realizado com sucesso',
//         html: AccountCreatedTemplate(name),
//       });
//     } catch {
//       throw new InternalServerErrorException();
//     }
//   }
// }

import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
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

    const result = await this.prisma.$transaction(async (prisma) => {
      // Criação do usuário
      const newUser = await prisma.users.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
      });

      // Criação dos dados do usuário
      await prisma.userData.create({
        data: {
          usersId: newUser.id,
          createdAt: new Date(),
        },
      });

      return newUser;
    });

    await this.sendCreatedAccountEmail(data.name, data.email);

    return result;
  }

  async sendCreatedAccountEmail(name: string, email: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'bondis@meudesafio.com',
        subject: 'Cadastro realizado com sucesso',
        html: AccountCreatedTemplate(name),
      });
    } catch {
      throw new InternalServerErrorException('Error sending email');
    }
  }
}
