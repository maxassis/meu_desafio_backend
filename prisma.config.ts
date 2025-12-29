import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { envSchema } from './src/env';

// Usa o mesmo schema de validação do NestJS para garantir consistência
const env = envSchema.parse(process.env);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env.DATABASE_URL,
  },
});
