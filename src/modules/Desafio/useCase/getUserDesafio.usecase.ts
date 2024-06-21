import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetUserDesafioUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getDesafio(idDesafio: string) {
    const desafio = await this.prisma.users.findUnique({
      where: { id: idDesafio },
      include: {
        Participation: true,
      },
    });

    return desafio?.Participation;
  }
}
