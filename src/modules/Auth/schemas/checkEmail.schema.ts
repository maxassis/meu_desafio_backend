import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CheckEmailSchema = z.object({
  email: z.string({ message: 'Email is required' }).email(),
});

export class CheckEmailDTO extends createZodDto(CheckEmailSchema) {}
