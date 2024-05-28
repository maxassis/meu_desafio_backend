import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const SendMailDoneSchema = z.object({
  email: z.string().email(),
});

export class SendMailDoneDTO extends createZodDto(SendMailDoneSchema) {}
