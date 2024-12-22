import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService<Env, true>) {
    const libsql = createClient({
      url: configService.get('TURSO_DATABASE_URL', { infer: true }),
      authToken: configService.get('TURSO_AUTH_TOKEN', { infer: true }),
    });

    const adapter = new PrismaLibSQL(libsql);

    // @ts-ignore
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}