import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { EditUserDataDTO } from '../schemas';
import { RedisService } from 'src/infra/cache/redis/redis.service';

@Injectable()
export class EditUserDataUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async editUserData(newData: EditUserDataDTO, id: string): Promise<any> {
    const user = await this.prisma.userData.update({
      where: { usersId: id },
      data: newData,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // ✅ Invalida o cache relacionado ao usuário
    await this.redisService.del(`user:${id}:data`);

    return user;
  }
}
