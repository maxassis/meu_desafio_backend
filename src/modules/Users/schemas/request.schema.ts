import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const UserDataReqSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  id: z.string(),
  iat: z.date(),
  exp: z.date(),
});

export const CreateRequestSchema = z.object({
  user: UserDataReqSchema,
});

export class RequestSchemaDTO extends createZodDto(CreateRequestSchema) {}
