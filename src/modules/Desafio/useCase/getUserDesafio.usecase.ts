import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetUserDesafioUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getDesafio(userId: string) {
    const desafio = await this.prisma.inscription.findMany({
      where: { userId: userId },
      include: {
        desafio: {
          select: {
            // id: true,
            name: true,
            description: true,
            distance: true,
            photo: true,
          },
        },
      },
    });

    return desafio;
  }
}
