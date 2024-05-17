import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { PrismaService } from 'src/infra/database/prisma.service';
import { SignInUseCase } from './useCase/signin.usecase';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [LoginController],
  providers: [PrismaService, SignInUseCase],
  exports: [],
})
export class LoginModule {}
