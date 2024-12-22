import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  REDIS_PORT: z.string(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string(),
  SUPABASE_BUCKET: z.string(),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  TURSO_AUTH_TOKEN: z.string(),
  TURSO_DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;
