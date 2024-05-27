import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const SendMailRecoverySchema = z.object({
  email: z.string().email(),
});

export class SendMailRecoveryDTO extends createZodDto(SendMailRecoverySchema) {}
