import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class CreatePaymentUseCase {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    userId: string,
    desafioId: number,
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId,
        desafioId,
      },
    });
  }

  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    );
  }

  // já existe: createCheckoutSession(...)
}
