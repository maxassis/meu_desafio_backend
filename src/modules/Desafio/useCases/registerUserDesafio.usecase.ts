import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class RegisterUserDesafioUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async registerUserDesafio(idDesafio: string, idUser: string) {
    // verifica se o desafio existe
    const desafio = await this.prisma.desafio.findUnique({
      where: { id: +idDesafio },
      include: { participation: true },
    });

    if (!desafio) {
      throw new NotFoundException(`Desafio with ID ${idDesafio} not found`);
    }

    // Verificar se o usuário existe e se já está registrado no desafio
    const usuario = await this.prisma.users.findUnique({
      where: { id: idUser },
      include: {
        Participation: {
          where: { desafioId: +idDesafio },
        },
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${idUser} não encontrado.`);
    }

    if (usuario.Participation.length > 0) {
      throw new BadRequestException(
        `Usuário já está registrado neste desafio.`,
      );
    }

    return this.prisma.desafio.update({
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
  }
}
