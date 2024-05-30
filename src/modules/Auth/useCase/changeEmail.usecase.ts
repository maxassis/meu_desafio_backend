import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class ChangeEmailUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async changeEmail(email: string, new_password: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordHash = await hash(new_password, 10);

    return await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: passwordHash,
      },
    });
  }
}
