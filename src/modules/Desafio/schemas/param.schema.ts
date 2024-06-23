import { z } from 'zod';

export const ParamSchema = z.object({
  id: z.string().min(1),
});
