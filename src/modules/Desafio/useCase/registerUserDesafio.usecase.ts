import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class RegisterUserDesafioUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async registerUserDesafio(idDesafio: string, idUser: string) {
    const desafio = await this.prisma.desafio.findUnique({
      where: { id: +idDesafio },
      include: {
        participation: {
          where: { userId: idUser },
        },
      },
    });

    if (!desafio) {
      throw new NotFoundException(`Desafio with ID ${idDesafio} not found`);
    }

    if (desafio.participation.length > 0) {
      throw new BadRequestException(
        `User already registered for this challenge.`,
      );
    }

    const result = await this.prisma.desafio.update({
      where: { id: +idDesafio },
      data: {
        participation: {
          create: {
            userId: idUser,
            progress: 0,
          },
        },
      },
      include: { participation: true },
    });

    if (!result) {
      throw new BadRequestException('Error registering user');
    }

    return 'Desafio registrado com sucesso';
  }
}
