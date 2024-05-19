import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateSignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class SignInSchemaDTO extends createZodDto(CreateSignInSchema) {}
