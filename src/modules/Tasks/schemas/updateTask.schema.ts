import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const isoDateTimeUtcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

const UpdateTaskSchema = z.object({
  name: z.string().optional(),
  environment: z.enum(['livre', 'esteira']),
  date: z
    .string()
    .optional()
    .refine(
      (value) => {
        return value ? isoDateTimeUtcRegex.test(value) : true;
      },
      {
        message: 'Invalid date format. Expected YYYY-MM-DDTHH:MM:SSZ.',
      },
    ),
  duration: z.string().optional(),
  calories: z.number().optional(),
  distanceKm: z.number(),
  local: z.string().optional(),
});

export class UpdateTaskDTO extends createZodDto(UpdateTaskSchema) {}
