import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  amount: z.coerce.number().min(1, 'Amount is required'),
  currency: z.string().min(1, 'Currency is required'),
  userId: z.string().min(1, 'UserId is required'),
  desafioId: z.number().min(1, 'DesafioId is required'),
});

export class CreatePaymentIntentDTO extends createZodDto(CreatePaymentSchema) {}
