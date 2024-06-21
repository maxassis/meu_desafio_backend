import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateDesafioSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullish().optional(),
  location: z.string(),
});

export class CreateDesafioDTO extends createZodDto(CreateDesafioSchema) {}
