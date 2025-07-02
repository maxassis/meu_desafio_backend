import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env';

@Injectable()
export class StripeCheckoutService {
  private stripe: Stripe;

  constructor(private configService: ConfigService<Env, true>) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY', { infer: true }),
      {
        apiVersion: '2025-05-28.basil',
      },
    );
  }

  async createCheckoutSession(
    email: string,
    priceId: string,
    desafioId: string,
    userId: string,
  ): Promise<string> {
    // const frontendUrl = process.env.FRONTEND_URL!;
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      // success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: 'https://google.com',
      cancel_url: `https://google.com`,
      metadata: {
        desafioId: desafioId,
        userId: userId,
      },
    });

    if (!session.url) {
      throw new Error('Failed to create Stripe checkout session');
    }

    return session.url;
  }

  constructEvent(rawBody: string, signature: string) {
    const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET', {
      infer: true,
    });
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      endpointSecret,
    );
  }
}
