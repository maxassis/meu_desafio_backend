import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ConfirmCodeSchema = z.object({
  email: z.string().email(),
  code: z.string(),
});

export class ConfirmCodeDTO extends createZodDto(ConfirmCodeSchema) {}
