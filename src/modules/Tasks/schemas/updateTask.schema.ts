import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const UpdateTaskSchema = z.object({
  name: z.string().optional(),
  environment: z.enum(['livre', 'esteira']),
  date: z.date().optional(),
  duration: z.string().optional(),
  calories: z.number().optional(),
  distanceKm: z.number(),
  local: z.string().optional(),
});

export class UpdateTaskDTO extends createZodDto(UpdateTaskSchema) {}
