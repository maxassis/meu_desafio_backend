import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class CreateDesafioUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async createDesafio(
    name: string,
    description: string | null | undefined,
    location: Array<{ latitude: number; longitude: number }>,
  ) {
    const desafioExists = await this.prisma.desafio.findFirst({
      where: {
        name,
      },
    });

    if (desafioExists) {
      throw new HttpException('Name already exists', HttpStatus.CONFLICT);
    }

    const result = await this.prisma.desafio.create({
      data: {
        name,
        description,
        location,
      },
    });

    if (!result) {
      throw new HttpException(
        'Error creating desafio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Desafio criado com sucesso' };
  }
}
