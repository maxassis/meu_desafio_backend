import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { EditUserDataDTO } from '../schemas';

@Injectable()
export class EditUserDataUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async editUserData(newData: EditUserDataDTO, id: string): Promise<any> {
    const user = await this.prisma.userData.update({
      where: { usersId: id },
      data: newData,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
