import { Module } from '@nestjs/common';
import { PaymentsController } from './payment.controller';
import { StripeService } from 'src/infra/providers/payment/stripe-payment';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RegisterUserDesafioUseCase } from './useCases/registerUserDesafio.usecase';
import { RedisService } from 'src/infra/cache/redis/redis.service';

@Module({
  providers: [
    StripeService,
    PrismaService,
    RegisterUserDesafioUseCase,
    RedisService,
  ],
  controllers: [PaymentsController],
})
export class StripeModule {}
