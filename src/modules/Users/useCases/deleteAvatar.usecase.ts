// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/infra/database/prisma.service';
// import { CloudflareR2Service } from 'src/infra/providers/storage/storage-r2';
// import { RedisService } from 'src/infra/cache/redis/redis.service';

// @Injectable()
// export class DeleteAvatarUseCase {
//   constructor(
//     private readonly cloudflareR2: CloudflareR2Service,
//     private readonly prisma: PrismaService,
//     private readonly redisService: RedisService,
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

//       // Remove o arquivo do Cloudflare R2
//       try {
//         await this.cloudflareR2.deleteFile(user.avatar_filename);
//       } catch (deleteError: unknown) {
//         const errorMessage =
//           deleteError instanceof Error
//             ? deleteError.message
//             : 'Erro desconhecido';
//         console.error(
//           'Erro ao deletar arquivo do Cloudflare R2:',
//           errorMessage,
//         );
//         throw new HttpException(
//           `Erro ao remover avatar do armazenamento: ${errorMessage}`,
//           HttpStatus.INTERNAL_SERVER_ERROR,
//         );
//       }

//       // Atualiza o banco de dados
//       const updatedUser = await this.prisma.userData.update({
//         where: {
//           usersId: id,
//         },
//         data: {
//           avatar_url: null,
//           avatar_filename: null,
//         },
//       });

//       // ✅ Invalida o cache do usuário
//       await this.redisService.del(`user:${id}:data`);

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
import { CloudflareR2Service } from 'src/infra/providers/storage/storage-r2';
import { RedisService } from 'src/infra/cache/redis/redis.service';

@Injectable()
export class DeleteAvatarUseCase {
  constructor(
    private readonly cloudflareR2: CloudflareR2Service,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async deleteAvatar(id: string): Promise<any> {
    const bucketName = 'avatars'; // ✅ bucket explícito

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

      try {
        await this.cloudflareR2.deleteFile(user.avatar_filename, bucketName); // ✅ bucket passado dinamicamente
      } catch (deleteError: unknown) {
        const errorMessage =
          deleteError instanceof Error
            ? deleteError.message
            : 'Erro desconhecido';
        console.error(
          'Erro ao deletar arquivo do Cloudflare R2:',
          errorMessage,
        );
        throw new HttpException(
          `Erro ao remover avatar do armazenamento: ${errorMessage}`,
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

