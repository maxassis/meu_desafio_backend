import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env';

@Injectable()
export class Supabase {
  readonly client: SupabaseClient;

  constructor(private configService: ConfigService<Env, true>) {
    this.client = createClient(
      this.configService.get('SUPABASE_URL', { infer: true }),
      this.configService.get('SUPABASE_KEY', { infer: true }),
    );
  }
}
