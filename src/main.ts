// import { NestFactory } from '@nestjs/core';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';
// import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
// import { Env } from './env';
// import fastifyCors from '@fastify/cors';
// import fastifyMultipart from '@fastify/multipart';

// async function bootstrap() {
//   const app = await NestFactory.create<NestFastifyApplication>(
//     AppModule,
//     new FastifyAdapter({ ignoreTrailingSlash: true }),
//     {
//       rawBody: true,
//     },
//   );

//   await app.register(fastifyCors, {
//     origin: true,
//     credentials: true,
//   });

//   await app.register(fastifyMultipart);

//   const configService: ConfigService<Env, true> = app.get(ConfigService);
//   const port = configService.get('PORT', { infer: true });

//   await app.listen(port, '0.0.0.0');
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ ignoreTrailingSlash: true }),
    {
      rawBody: true,
    },
  );

  await app.register(fastifyCors, {
    origin: true,
    credentials: true,
  });

  await app.register(fastifyMultipart);

  // ✅ Swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Minha API')
    .setDescription('Documentação da API gerada automaticamente')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, swaggerDocument);

  // ✅ (Opcional) Gerar o arquivo swagger.json para importar no Scalar
  // import { writeFileSync } from 'fs';
  // writeFileSync('./swagger.json', JSON.stringify(swaggerDocument, null, 2));

  const configService: ConfigService<Env, true> = app.get(ConfigService);
  const port = configService.get('PORT', { infer: true });

  await app.listen(port, '0.0.0.0');
}
bootstrap();
