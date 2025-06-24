import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import { StripeService } from '../../infra/providers/payment/stripe-payment';
import Stripe from 'stripe';
import { CheckoutDTO } from './schemas/checkout.schema';

// interface RawBodyRequest extends Request {
//   rawBody: Buffer;
// }

@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}

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

  // @Post('webhook-debug')
  // async debugWebhook(@Req() request: RawBodyRequest) {
  //   console.log('=== DEBUG WEBHOOK ===');
  //   console.log('🔍 Headers:', request.headers);
  //   console.log('🔍 Body type:', typeof request.body);
  //   console.log('🔍 Raw body type:', typeof request.rawBody);
  //   console.log(
  //     '🔍 Raw body length:',
  //     request.rawBody ? request.rawBody.length : 'undefined',
  //   );
  //   console.log('🔍 Has raw body:', !!request.rawBody);

  //   // ✅ COMO USAR O RAW BODY:
  //   if (request.rawBody) {
  //     // 1. Como Buffer (dados binários)
  //     console.log('📦 Raw body as Buffer:', request.rawBody);

  //     // 2. Como String UTF-8
  //     const bodyAsString = request.rawBody.toString('utf8');
  //     console.log('📝 Raw body as string:', bodyAsString);

  //     // 3. Como JSON (se for JSON válido)
  //     try {
  //       const bodyAsJson = JSON.parse(bodyAsString);
  //       console.log('🎯 Raw body as JSON:', bodyAsJson);
  //     } catch (error) {
  //       console.log('❌ Raw body is not valid JSON');
  //     }

  //     // 4. Como Base64 (útil para dados binários)
  //     const bodyAsBase64 = request.rawBody.toString('base64');
  //     console.log('🔐 Raw body as Base64:', bodyAsBase64);

  //     // 5. Verificar encoding específico
  //     const bodyAsHex = request.rawBody.toString('hex');
  //     console.log('🔢 Raw body as Hex:', bodyAsHex);
  //   }

  //   console.log('=====================');

  //   return {
  //     message: 'Debug complete - Raw body usage examples above',
  //     hasRawBody: !!request.rawBody,
  //     rawBodyType: typeof request.rawBody,
  //     rawBodyLength: request.rawBody?.length || 0,
  //     // Retorna os dados processados
  //     data: request.rawBody
  //       ? {
  //           asString: request.rawBody.toString('utf8'),
  //           asBase64: request.rawBody.toString('base64'),
  //           asHex: request.rawBody.toString('hex'),
  //           length: request.rawBody.length,
  //         }
  //       : null,
  //   };
  // }

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
        // console.log(`✅ Pagamento confirmado. Session ID: ${session.id}`);
        // console.log(`Cliente: ${session.customer_email}`);

        if (!session.metadata) {
          throw new Error('Session metadata is missing');
        }

        console.log(session.metadata.desafioId);

        await this.handleCheckoutCompleted(session);
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
