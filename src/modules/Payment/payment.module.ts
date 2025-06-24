import { Module } from '@nestjs/common';
import { PaymentsController } from './payment.controller';
import { StripeService } from 'src/infra/providers/payment/stripe-payment';

@Module({
  providers: [StripeService],
  //   exports: [StripeService],
  controllers: [PaymentsController],
})
export class StripeModule {}
