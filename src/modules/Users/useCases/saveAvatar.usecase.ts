import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';

@Injectable()
export class UploadAvatarUseCase {
  constructor(
    private readonly supabase: Supabase,
    private readonly prisma: PrismaService,
  ) {}

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<any> {
    const extFile = extname(file.originalname);
    const newName = `${id}${extFile}`;

    const data = await this.supabase.client.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(newName, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    return data;
  }
}
