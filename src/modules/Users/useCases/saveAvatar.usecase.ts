import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env';

// Definindo a interface para o arquivo do Fastify
interface FastifyFileInterceptorFile {
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class UploadAvatarUseCase {
  constructor(
    private readonly supabase: Supabase,
    private readonly prisma: PrismaService,
    private configService: ConfigService<Env, true>,
  ) {}

  async uploadAvatar(
    id: string,
    file: FastifyFileInterceptorFile,
  ): Promise<any> {
    if (!file || !file.mimetype) {
      throw new HttpException(
        'Nenhum arquivo fornecido ou formato inválido.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new HttpException(
        'O arquivo enviado não é uma imagem.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.userData.findUnique({
      where: { usersId: id },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }

    if (user.avatar_filename) {
      const { error: deleteError } = await this.supabase.client.storage
        .from('avatars')
        .remove([user.avatar_filename]);

      if (deleteError) {
        throw new HttpException(
          `Erro ao remover avatar antigo: ${deleteError.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    let fileExtension = '';
    if (file.filename) {
      fileExtension = file.filename.split('.').pop() || '';
    } else if (file.mimetype) {
      fileExtension = file.mimetype.split('/').pop() || '';
    }

    const newFileName = `${id}-${Date.now()}${fileExtension ? '.' + fileExtension : ''}`;

    const fileUpload = await this.supabase.client.storage
      .from('avatars')
      .upload(newFileName, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    if (fileUpload.error) {
      throw new HttpException(
        `Erro ao fazer upload do arquivo: ${fileUpload.error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Gerar a URL pública corretamente com base no path real
    const { data: publicUrlData } = this.supabase.client.storage
      .from('avatars')
      .getPublicUrl(fileUpload.data.path);

    const publicUrl = publicUrlData.publicUrl;

    const updatedUser = await this.prisma.userData.update({
      where: { usersId: id },
      data: {
        avatar_url: publicUrl,
        avatar_filename: fileUpload.data.path,
      },
    });

    return updatedUser;
  }
}
