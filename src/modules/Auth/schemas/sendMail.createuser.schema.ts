import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const SendMailCreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export class SendMailCreateUserDTO extends createZodDto(
  SendMailCreateUserSchema,
) {}
