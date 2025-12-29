import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserDataReqSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  id: z.string().min(1),
  iat: z.date(),
  exp: z.date(),
});

export const CreateRequestSchema = z.object({
  user: UserDataReqSchema,
});

export class RequestSchemaDTO extends createZodDto(CreateRequestSchema) {}
