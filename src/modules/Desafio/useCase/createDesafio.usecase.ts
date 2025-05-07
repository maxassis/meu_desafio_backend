import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { randomUUID } from 'crypto';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';

interface MulterLikeFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class CreateDesafioUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: Supabase,
  ) {}

  async createDesafio(
    name: string,
    description: string,
    location: Array<{ latitude: number; longitude: number }>,
    distance: number,
    imageFile: MulterLikeFile,
  ) {
    const desafioExists = await this.prisma.desafio.findFirst({
      where: { name },
    });

    if (desafioExists) {
      throw new HttpException('Name already exists', HttpStatus.CONFLICT);
    }

    let imageUrl: string | null = null;

    if (imageFile) {
      const fileName = `${randomUUID()}-${imageFile.originalname}`;
      const { error } = await this.supabase.client.storage
        .from('desafios')
        .upload(fileName, imageFile.buffer, {
          contentType: imageFile.mimetype,
        });

      if (error) {
        throw new HttpException(
          'Error uploading image to Supabase',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const { data: dataUrl } = this.supabase.client.storage
        .from('desafios')
        .getPublicUrl(fileName);

      imageUrl = dataUrl.publicUrl;
    }

    const result = await this.prisma.desafio.create({
      data: {
        name,
        description,
        location: location,
        distance,
        photo: imageUrl ? imageUrl : undefined,
      },
    });

    if (!result) {
      throw new HttpException(
        'Error creating desafio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Desafio created successfully' };
  }
}
