import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const Gender = z.enum([
  'homem',
  'mulher',
  'nao_binario',
  'prefiro_nao_responder',
]);

const Sports = z.enum(['corrida', 'bicicleta']);

export const EditUserDataSchema = z.object({
  avatar_url: z.string().optional(),
  avatar_filename: z.string().optional(),
  full_name: z.string().optional(),
  bio: z.string().optional(),
  gender: Gender.optional(),
  sport: Sports.optional(),
});

export class EditUserDataDTO extends createZodDto(EditUserDataSchema) {}
