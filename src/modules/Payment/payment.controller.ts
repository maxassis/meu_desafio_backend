import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import { StripeService } from '../../infra/providers/payment/stripe-payment';
import Stripe from 'stripe';
import { CheckoutDTO } from './schemas/checkout.schema';
import { RegisterUserDesafioUseCase } from './useCases/registerUserDesafio.usecase';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly stripeService: StripeService,
    private registerUserDesafioUseCase: RegisterUserDesafioUseCase,
  ) {}

  @Post('checkout-session')
  async createCheckoutSession(@Body() body: CheckoutDTO) {
    const { email, priceId, desafioId, userId } = body;

    const sessionUrl = await this.stripeService.createCheckoutSession(
      email,
      priceId,
      desafioId,
      userId,
    );
    return { url: sessionUrl };
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripeService.constructEvent(req.rawBody, signature);
    } catch (err) {
      if (err instanceof Error) {
        console.error('❌ Webhook signature verification failed.', err.message);
        throw new Error(`Webhook Error: ${err.message}`);
      } else {
        console.error('❌ Unknown error:', err);
        throw new Error('Unknown error');
      }
    }

    // Lida com os eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.metadata) {
          throw new Error('Session metadata is missing');
        }

        await this.registerUserDesafioUseCase.registerUserDesafio(
          session.metadata.desafioId,
          session.metadata.userId,
        );
        break;
      }

      default:
      // console.log(`⚠️ Evento não tratado: ${event.type}`);
    }

    return { received: true };
  }

  // Método auxiliar para processar checkout completado
  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const metadata = session.metadata;

    if (metadata) {
      const userId = metadata.userId;
      const desafioId = metadata.desafioId;

      console.log('📊 Processando dados:');
      console.log('- User ID:', userId);
      console.log('- Desafio ID:', desafioId);
    }
  }
}
