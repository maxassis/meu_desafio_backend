import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const DeleteAvatarSchema = z.object({
  filename: z.string().min(1),
});

export class DeleteAvatarDTO extends createZodDto(DeleteAvatarSchema) {}
