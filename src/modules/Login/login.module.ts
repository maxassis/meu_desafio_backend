import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { PrismaService } from 'src/infra/database/prisma.service';
import { SignInUseCase } from './useCase/signin.usecase';
import { JwtModule } from '@nestjs/jwt';
import { GetCodeUseCase } from './useCase/getCode.usecase';
import { RedisService } from 'src/infra/database/redis.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '90d' },
    }),
  ],
  controllers: [LoginController],
  providers: [PrismaService, SignInUseCase, GetCodeUseCase, RedisService],
  exports: [],
})
export class LoginModule {}