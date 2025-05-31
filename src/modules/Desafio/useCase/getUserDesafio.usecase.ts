import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetUserDesafioUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getDesafio(userId: string) {
    const inscricoes = await this.prisma.inscription.findMany({
      where: { userId: userId },
      include: {
        desafio: {
          select: {
            name: true,
            description: true,
            distance: true,
            photo: true,
          },
        },
      },
    });

    const desafios = inscricoes.map((inscricao) => ({
      ...inscricao.desafio,
      isRegistered: true,
      completed: inscricao.completed,
    }));

    return desafios;
  }
}
