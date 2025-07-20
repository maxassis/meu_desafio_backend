import { Module } from '@nestjs/common';
import { PaymentsController } from './payment.controller';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RegisterUserDesafioUseCase } from './useCases/registerUserDesafio.usecase';
import { RedisService } from 'src/infra/cache/redis/redis.service';
import { StripePaymentIntentService } from 'src/infra/providers/payment/stripe-paymentIntent';
import { StripeCheckoutService } from 'src/infra/providers/payment/stripe-checkout';

@Module({
  providers: [
    StripePaymentIntentService,
    StripeCheckoutService,
    PrismaService,
    RegisterUserDesafioUseCase,
    RedisService,
  ],
  controllers: [PaymentsController],
})
export class StripeModule {}
