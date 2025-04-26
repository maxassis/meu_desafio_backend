import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetDesafioUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getDesafio(idDesafio: string) {
    const desafio = await this.prisma.desafio.findUnique({
      where: { id: +idDesafio },
      include: {
        participation: {
          where: {
            completed: false,
          },
          select: {
            desafioId: false,
            progress: true,
            user: {
              select: {
                id: true,
                name: true,
                UserData: {
                  select: {
                    avatar_url: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!desafio) {
      throw new NotFoundException(`Desafio with ID ${idDesafio} not found`);
    }

    return desafio;
  }
}