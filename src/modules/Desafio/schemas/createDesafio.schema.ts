import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const LocationSchema = z.tuple([z.number(), z.number()]);

const CreateDesafioSchema = z.object({
  name: z.string(),
  description: z.string(),
  location: z.array(LocationSchema),
});

export class CreateDesafioDTO extends createZodDto(CreateDesafioSchema) {}
