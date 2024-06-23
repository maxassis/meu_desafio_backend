import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetUserDataUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getUserData(id: string, name: string) {
    const user = await this.prisma.userData.findUnique({
      where: {
        usersId: id,
      },
    });

    return {
      ...user,
      username: name,
    };
  }
}
