import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateSignInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export class SignInSchemaDTO extends createZodDto(CreateSignInSchema) {}
