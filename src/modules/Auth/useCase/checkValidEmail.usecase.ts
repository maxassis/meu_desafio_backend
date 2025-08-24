import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class CheckEmailUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async checkEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (user) {
      throw new HttpException(
        { message: 'Email already registered.' },
        HttpStatus.CONFLICT, // 409 Conflict
      );
    }

    // If the email is not registered, return null
    return null;
  }
}
