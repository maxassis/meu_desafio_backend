import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateUserDTO } from '../dto/user.dto';
import { hash } from 'bcrypt';
import { IUserRepository } from '../repositories/user.repository';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private prisma: PrismaService,
  ) {}

  async create(data: CreateUserDTO) {
    const user = await this.prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const password = await hash(data.password, 10);

    return await this.prisma.users.create({
      data: {
        ...data,
        password,
      },
    });
  }
}
