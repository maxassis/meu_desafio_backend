import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { SignInSchemaDTO } from '../schemas/signin.schema';
import { compare } from 'bcrypt';

@Injectable()
export class SignInUseCase {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async execute(data: SignInSchemaDTO) {
    const user = await this.prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isEqualPassword = await compare(data.password, user.password);

    if (!isEqualPassword) {
      throw new UnauthorizedException();
    }

    const payload = {
      name: user.name,
      email: user.email,
      id: user.id,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
