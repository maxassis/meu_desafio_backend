import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';


const UpdateTaskSchema = z.object({
  name: z.string().optional(),
  environment: z.enum(['livre', 'esteira']),
  date: z.string().datetime({
    message: 'Invalid date format. Expected YYYY-MM-DDTHH:MM:SSZ.',
  }),
  duration: z
    .number({ message: 'duration Required' })
    .positive({ message: 'duration must be greater than zero' }),
  calories: z.number().optional(),
  distanceKm: z.number(),
  local: z.string().optional(),
  gpsTask: z.boolean().optional(),
});

export class UpdateTaskDTO extends createZodDto(UpdateTaskSchema) {}
