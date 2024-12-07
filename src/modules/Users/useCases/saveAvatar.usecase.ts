import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    // const extFile = extname(file.originalname);
    const newName = id;

    if (!file.mimetype.startsWith('image/')) {
      throw new HttpException(
        'the file is not a image',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const fileUpload = await this.supabase.client.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(newName, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    if (fileUpload.error) {
      throw new HttpException("Can't upload file", HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.userData.update({
      where: {
        usersId: id,
      },
      data: {
        avatar_url:
          'https://iijythvtsrfruihwseua.supabase.co/storage/v1/object/public/avatars/' +
          fileUpload.data.path,
        avatar_filename: fileUpload.data.path,
      },
    });

    if (!user) {
      throw new HttpException("Can't upload file", HttpStatus.BAD_REQUEST);
    }

    return {
      avatar_url: user.avatar_url,
      avatar_filename: user.avatar_filename,
    };
  }
}
