import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const ChecjEmailSchema = z.object({
  email: z.string().email(),
});

export class CheckEmailDTO extends createZodDto(ChecjEmailSchema) {}
