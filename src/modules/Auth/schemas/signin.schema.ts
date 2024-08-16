import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CreateSignInSchema = z.object({
  email: z.string({ message: 'Email is required' }).email(),
  password: z
    .string({ message: 'Password is required, minimum 8 characters' })
    .min(8),
});

export class SignInSchemaDTO extends createZodDto(CreateSignInSchema) {}
