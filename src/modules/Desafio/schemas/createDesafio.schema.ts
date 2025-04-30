import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const coordinateSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const coordinatesArraySchema = z.array(coordinateSchema);

const CreateDesafioSchema = z.object({
  name: z.string(),
  description: z.string(),
  location: coordinatesArraySchema,
  distance: z.number(),
  photo: z.string().url(),
});

export class CreateDesafioDTO extends createZodDto(CreateDesafioSchema) {}
