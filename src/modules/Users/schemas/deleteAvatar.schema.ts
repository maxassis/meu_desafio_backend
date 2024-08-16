import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const DeleteAvatarSchema = z.object({
  filename: z.string().min(1),
});

export class DeleteAvatarDTO extends createZodDto(DeleteAvatarSchema) {}
