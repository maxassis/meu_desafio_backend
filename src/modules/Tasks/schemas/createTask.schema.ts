import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

// const isoDateTimeUtcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

const CreateTaskSchema = z.object({
  name: z.string().optional(),
  environment: z.enum(['livre', 'esteira']),
  // date: z.string().refine(
  //   (value) => {
  //     return value ? isoDateTimeUtcRegex.test(value) : true;
  //   },
  //   {
  //     message: 'Invalid date format. Expected YYYY-MM-DDTHH:MM:SSZ.',
  //   },
  // ),
  date: z.string().datetime({
    message: 'Invalid date format. Expected YYYY-MM-DDTHH:MM:SSZ.',
  }),
  duration: z.string().datetime({
    message: 'Invalid date format , Expected YYYY-MM-DDTHH:MM:SSZ',
  }),
  calories: z.number().optional(),
  distance: z.number({ message: 'distance Required' }),
  local: z.string().optional(),
  participationId: z.number({ message: 'participationId Required' }),
});

export class CreateTaskDTO extends createZodDto(CreateTaskSchema) {}
