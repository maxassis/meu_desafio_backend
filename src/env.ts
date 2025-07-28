import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string(),
  SUPABASE_BUCKET: z.string(),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  PORT: z.coerce.number().optional().default(3000),
  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_PUBLIC_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
