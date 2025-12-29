import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SendMailDoneSchema = z.object({
  email: z.string().email(),
});

export class SendMailDoneDTO extends createZodDto(SendMailDoneSchema) {}
