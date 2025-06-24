import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CheckoutSchema = z.object({
  email: z.string().email(),
  priceId: z.string().min(1, 'PriceId is required'),
  desafioId: z.string().min(1, 'DesafioId is required'),
  userId: z.string().min(1, 'UserId is required'),
});

export class CheckoutDTO extends createZodDto(CheckoutSchema) {}
