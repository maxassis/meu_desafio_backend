// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/infra/database/prisma.service';
// import { Supabase } from 'src/infra/providers/storage/storage-supabase';

// @Injectable()
// export class DeleteAvatarUseCase {
//   constructor(
//     private readonly supabase: Supabase,
//     private readonly prisma: PrismaService,
//   ) {}

//   async deleteAvatar(id: string): Promise<any> {
//     try {
//       const user = await this.prisma.userData.findUnique({
//         where: {
//           usersId: id,
//         },
//       });

//       if (!user || !user.avatar_filename) {
//         throw new HttpException(
//           'Usuário não encontrado ou avatar não existente.',
//           HttpStatus.NOT_FOUND,
//         );
//       }

//       const { error: deleteError } = await this.supabase.client.storage
//         .from('avatars')
//         .remove([user.avatar_filename]);

//       if (deleteError) {
//         console.error(
//           'Erro ao deletar arquivo do Supabase:',
//           deleteError.message,
//         );
//         throw new HttpException(
//           `Erro ao remover avatar do armazenamento: ${deleteError.message}`,
//           HttpStatus.INTERNAL_SERVER_ERROR,
//         );
//       }

//       const updatedUser = await this.prisma.userData.update({
//         where: {
//           usersId: id,
//         },
//         data: {
//           avatar_url: null,
//           avatar_filename: null,
//         },
//       });

//       return updatedUser;
//     } catch (error) {
//       if (error instanceof HttpException) {
//         throw error;
//       }

//       console.error('Erro inesperado ao remover avatar:', error);
//       throw new HttpException(
//         'Erro inesperado ao remover avatar.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';
import { RedisService } from 'src/infra/cache/redis/redis.service';

@Injectable()
export class DeleteAvatarUseCase {
  constructor(
    private readonly supabase: Supabase,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async deleteAvatar(id: string): Promise<any> {
    try {
      const user = await this.prisma.userData.findUnique({
        where: {
          usersId: id,
        },
      });

      if (!user || !user.avatar_filename) {
        throw new HttpException(
          'Usuário não encontrado ou avatar não existente.',
          HttpStatus.NOT_FOUND,
        );
      }

      const { error: deleteError } = await this.supabase.client.storage
        .from('avatars')
        .remove([user.avatar_filename]);

      if (deleteError) {
        console.error(
          'Erro ao deletar arquivo do Supabase:',
          deleteError.message,
        );
        throw new HttpException(
          `Erro ao remover avatar do armazenamento: ${deleteError.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const updatedUser = await this.prisma.userData.update({
        where: {
          usersId: id,
        },
        data: {
          avatar_url: null,
          avatar_filename: null,
        },
      });

      // ✅ Invalida o cache do usuário
      await this.redisService.del(`user:${id}:data`);

      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Erro inesperado ao remover avatar:', error);
      throw new HttpException(
        'Erro inesperado ao remover avatar.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
