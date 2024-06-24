import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const LocationSchema = z.tuple([z.number(), z.number()]);

const CreateDesafioSchema = z.object({
  name: z.string(),
  description: z.string(),
  location: z.array(LocationSchema),
});

export class CreateDesafioDTO extends createZodDto(CreateDesafioSchema) {}
