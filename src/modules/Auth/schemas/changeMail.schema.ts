import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const ChangeMailSchema = z.object({
  email: z.string().email(),
  new_password: z.string(),
});

export class ChangeMailDTO extends createZodDto(ChangeMailSchema) {}
