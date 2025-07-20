import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { StripeCheckoutService } from '../../infra/providers/payment/stripe-checkout';
import Stripe from 'stripe';
import { CheckoutDTO, CreatePaymentIntentDTO } from './schemas';
import { RegisterUserDesafioUseCase } from './useCases/registerUserDesafio.usecase';
import { StripePaymentIntentService } from 'src/infra/providers/payment/stripe-paymentIntent';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly stripeCheckoutService: StripeCheckoutService,
    private readonly stripePaymentService: StripePaymentIntentService,
    private registerUserDesafioUseCase: RegisterUserDesafioUseCase,
  ) {}

  @Post('checkout-session')
  async createCheckoutSession(@Body() body: CheckoutDTO) {
    const { email, priceId, desafioId, userId } = body;

    const sessionUrl = await this.stripeCheckoutService.createCheckoutSession(
      email,
      priceId,
      desafioId,
      userId,
    );
    return { url: sessionUrl };
  }

  @Post('payment-intent')
  async createPaymentIntent(@Body() body: CreatePaymentIntentDTO) {
    const { amount, currency, userId, desafioId } = body;

    try {
      const paymentIntent = await this.stripePaymentService.createPaymentIntent(
        amount,
        currency,
        userId,
        String(desafioId),
      );

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error('❌ Failed to create payment intent:', error);
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;
    console.log('📩 Webhook recebido');
  
    try {
      event = this.stripeCheckoutService.constructEvent(req.rawBody, signature);
      console.log('✅ Evento construído com sucesso:', event.type);
    } catch (err) {
      if (err instanceof Error) {
        console.error('❌ Webhook signature verification failed.', err.message);
        throw new BadRequestException(`Webhook Error: ${err.message}`);
      } else {
        console.error('❌ Unknown error:', err);
        throw new BadRequestException('Unknown error');
      }
    }
  
    if (event.type !== 'checkout.session.completed') {
      console.log(`⚠️ Evento ignorado: ${event.type}`);
      return { received: true };
    }
  
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('✅ Checkout Session:', session.id);
  
      const metadata = session.metadata;
      console.log('📦 Metadata completo:', JSON.stringify(metadata, null, 2));
      console.log('📦 Chaves disponíveis nos metadados:', Object.keys(metadata || {}));
  
      if (!metadata) {
        throw new Error('Metadata ausente no Checkout Session');
      }
  
      const { userId, desafioId } = metadata;
      console.log('🔍 userId extraído:', userId);
      console.log('🔍 desafioId extraído:', desafioId);
  
      if (!userId || !desafioId) {
        console.error('❌ Dados ausentes - userId:', userId, 'desafioId:', desafioId);
        throw new Error('userId ou desafioId ausente');
      }
  
      await this.registerUserDesafioUseCase.registerUserDesafio(desafioId, userId);
  
      console.log(`✅ [Checkout] User registrado no desafio ${desafioId}`);
  
      return { received: true };
    } catch (error) {
      console.error('❌ Error processing webhook event:', error);
      throw new InternalServerErrorException('Error processing webhook');
    }
  }
  
}
