import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const SendMailDoneSchema = z.object({
  email: z.string().email(),
});

export class SendMailDoneDTO extends createZodDto(SendMailDoneSchema) {}
