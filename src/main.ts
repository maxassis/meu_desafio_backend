import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart'; // ✅ Importa multipart

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ ignoreTrailingSlash: true }),
  );

  // ✅ Registra CORS
  await app.register(fastifyCors, {
    origin: true,
    credentials: true,
  });

  // ✅ Registra suporte a multipart/form-data
  await app.register(fastifyMultipart);

  const configService: ConfigService<Env, true> = app.get(ConfigService);
  const port = configService.get('PORT', { infer: true });

  await app.listen(port, '0.0.0.0');
}
bootstrap();
