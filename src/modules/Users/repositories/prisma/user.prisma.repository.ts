import { PrismaService } from 'src/infra/database/prisma.service';
import { IUserRepository } from '../user.repository';
import {
  CreateUserDTO,
  UserCreatedDTO,
  UsernameAndEmail,
} from '../../dto/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findUsernameOrEmail(
    data: UsernameAndEmail,
  ): Promise<UserCreatedDTO | null> {
    return await this.prisma.users.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });
  }

  async save(data: CreateUserDTO) {
    return await this.prisma.users.create({
      data,
    });
  }
}
