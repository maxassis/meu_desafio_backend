import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const ChangePasswordSchema = z.object({
  email: z.string().email(),
  new_password: z.string().min(8),
});

export class ChangePasswordDTO extends createZodDto(ChangePasswordSchema) {}
