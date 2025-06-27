import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
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
        throw new BadRequestException(`Webhook Error: ${err.message}`);
      } else {
        console.error('❌ Unknown error:', err);
        throw new BadRequestException('Unknown error');
      }
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;

          if (!session.metadata) {
            throw new Error('Session metadata is missing');
          }

          const { userId, desafioId } = session.metadata;
          if (!userId || !desafioId) {
            throw new Error(
              'Required metadata (userId or desafioId) is missing',
            );
          }

          await this.registerUserDesafioUseCase.registerUserDesafio(
            desafioId,
            userId,
          );

          console.log(
            `✅ User registered successfully for desafio: ${desafioId}`,
          );
          break;
        }

        default:
        // console.log(`⚠️ Evento não tratado: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('❌ Error processing webhook event:', error);
      throw new InternalServerErrorException('Error processing webhook');
    }
  }
}
