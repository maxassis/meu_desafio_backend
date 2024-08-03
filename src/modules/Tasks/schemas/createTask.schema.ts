import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateTaskSchema = z.object({
  name: z.string().optional(),
  environment: z.enum(['livre', 'esteira']),
  date: z.date().optional(),
  duration: z.string().optional(),
  calories: z.number().optional(),
  distance: z.number(),
  local: z.string().optional(),
  participationId: z.number(),
});

export class CreateTaskDTO extends createZodDto(CreateTaskSchema) {}
