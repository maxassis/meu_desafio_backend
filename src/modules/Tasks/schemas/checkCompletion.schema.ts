import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CheckCompletionSchema = z.object({
  inscriptionId: z.number(),
  distance: z.number(),
});

export class CheckCompletionDTO extends createZodDto(CheckCompletionSchema) {}
