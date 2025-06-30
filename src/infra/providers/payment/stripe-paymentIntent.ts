import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Env } from 'src/env';

@Injectable()
export class StripePaymentIntentService {
  private stripe: Stripe;
  constructor(private configService: ConfigService<Env, true>) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY', { infer: true }),
      {
        apiVersion: '2025-05-28.basil',
      },
    );
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    userId: string,
    desafioId: string,
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
      this.configService.get('STRIPE_WEBHOOK_SECRET', { infer: true }),
    );
  }

  // já existe: createCheckoutSession(...)
}
