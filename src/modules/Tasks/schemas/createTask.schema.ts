import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';


const CreateTaskSchema = z.object({
  name: z.string(),
  environment: z.enum(['livre', 'esteira']),
  date: z.string().datetime({
    message: 'Invalid date format. Expected YYYY-MM-DDTHH:MM:SSZ.',
  }),
  duration: z
    .number({ message: 'duration Required' })
    .positive({ message: 'duration must be greater than zero' }),
  calories: z.number().optional(),
  distance: z.number({ message: 'distance Required' }),
  local: z.string().optional(),
  participationId: z.number({ message: 'participationId Required' }),
});

export class CreateTaskDTO extends createZodDto(CreateTaskSchema) {}
