import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateUserDTO } from '../dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(data: CreateUserDTO) {
    const user = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await hash(data.password, 10);

    return await this.prisma.users.create({
      data: {
        ...data,
        password: passwordHash,
      },
    });
  }
}
