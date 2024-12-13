import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';

@Injectable()
export class DeleteAvatarUseCase {
  constructor(
    private readonly supabase: Supabase,
    private readonly prisma: PrismaService,
  ) {}

  async deleteAvatar(id: string): Promise<any> {
    try {
      const user = await this.prisma.userData.update({
        where: {
          usersId: id,
        },
        data: {
          avatar_url: null,
          avatar_filename: null,
        },
      });

      return user;
    } catch (error) {
      // Tratamento de erros com mais detalhes
      if (error instanceof Error) {
        console.error(
          'Erro ao atualizar o avatar no banco de dados:',
          error.message,
        );
        throw new HttpException(
          `Erro ao remover avatar: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Erro inesperado ao remover avatar.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
