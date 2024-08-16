import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const SendMailCreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export class SendMailCreateUserDTO extends createZodDto(
  SendMailCreateUserSchema,
) {}
