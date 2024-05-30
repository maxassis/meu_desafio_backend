import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const ChangeMailSchema = z.object({
  email: z.string().email(),
  new_password: z.string(),
});

export class ChangeMailDTO extends createZodDto(ChangeMailSchema) {}