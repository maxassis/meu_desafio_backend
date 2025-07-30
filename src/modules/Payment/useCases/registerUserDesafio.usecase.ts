import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from 'src/infra/cache/redis/redis.service';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class RegisterUserDesafioUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async registerUserDesafio(idDesafio: string, idUser: string) {
    const desafio = await this.prisma.desafio.findUnique({
      where: { id: idDesafio },
      include: {
        inscription: {
          where: { userId: idUser },
        },
      },
    });

    if (!desafio) {
      throw new NotFoundException(`Desafio with ID ${idDesafio} not found`);
    }

    if (desafio.inscription.length > 0) {
      throw new BadRequestException(
        `User already registered for this challenge.`,
      );
    }

    const result = await this.prisma.desafio.update({
      where: { id: idDesafio },
      data: {
        inscription: {
          create: {
            userId: idUser,
            progress: 0,
          },
        },
      },
      include: { inscription: true },
    });

    if (!result) {
      throw new BadRequestException('Error registering user');
    }

    await Promise.all([
      this.redisService.del(`user:${idUser}:desafios`),
      this.redisService.del(`desafio:${idDesafio}`),
      // this.redisService.del(`user:${idUser}:my-desafios`),
    ]);

    return { message: 'User registered successfully.' };
  }
}
