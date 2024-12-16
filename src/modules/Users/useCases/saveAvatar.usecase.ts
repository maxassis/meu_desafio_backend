import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';

@Injectable()
export class UploadAvatarUseCase {
  constructor(
    private readonly supabase: Supabase,
    private readonly prisma: PrismaService,
  ) {}

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<any> {
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

    const newFileName = `${id}-${Date.now()}`;
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

    // Atualize o banco de dados com o novo avatar dentro da transação
    const updatedUser = await this.prisma.userData.update({
      where: { usersId: id },
      data: {
        avatar_url: `https://iijythvtsrfruihwseua.supabase.co/storage/v1/object/public/avatars/${fileUpload.data.path}`,
        avatar_filename: fileUpload.data.path,
      },
    });

    return updatedUser;
  }
}
