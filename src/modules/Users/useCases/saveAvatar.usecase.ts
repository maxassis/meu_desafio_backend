// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { RedisService } from 'src/infra/cache/redis/redis.service';
// import { PrismaService } from 'src/infra/database/prisma.service';
// import { CloudflareR2Service } from 'src/infra/providers/storage/storage-r2';

// interface FastifyFileInterceptorFile {
//   fieldname: string;
//   filename: string;
//   encoding: string;
//   mimetype: string;
//   buffer: Buffer;
//   size: number;
// }

// @Injectable()
// export class UploadAvatarUseCase {
//   constructor(
//     private readonly cloudflareR2: CloudflareR2Service,
//     private readonly prisma: PrismaService,
//     private readonly redisService: RedisService,
//   ) {}

//   async uploadAvatar(
//     id: string,
//     file: FastifyFileInterceptorFile,
//   ): Promise<any> {
//     if (!file || !file.mimetype) {
//       throw new HttpException(
//         'Nenhum arquivo fornecido ou formato inválido.',
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     if (!file.mimetype.startsWith('image/')) {
//       throw new HttpException(
//         'O arquivo enviado não é uma imagem.',
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     const user = await this.prisma.userData.findUnique({
//       where: { usersId: id },
//     });

//     if (!user) {
//       throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
//     }

//     // Define bucket e base da URL pública
//     const bucketName = 'avatars';
//     const publicUrlBase = process.env.R2_PUBLIC_URL_AVATARS;

//     if (!publicUrlBase) {
//       throw new HttpException(
//         'URL pública do bucket avatars não configurada.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }

//     // Determina a extensão do arquivo
//     const fileExtension =
//       file.filename?.split('.').pop() ?? file.mimetype?.split('/').pop() ?? '';
//     const fileName = `${id}-avatar${fileExtension ? '.' + fileExtension : ''}`;

//     try {
//       await this.cloudflareR2.uploadFile(
//         fileName,
//         file.buffer,
//         file.mimetype,
//         bucketName,
//       );

//       const publicUrl = `${publicUrlBase}/${fileName}`;

//       const needsUpdate =
//         !user.avatar_filename || user.avatar_filename !== fileName;

//       let updatedUser = user;
//       if (needsUpdate) {
//         updatedUser = await this.prisma.userData.update({
//           where: { usersId: id },
//           data: {
//             avatar_url: publicUrl,
//             avatar_filename: fileName,
//           },
//         });
//       }

//       await this.redisService.del(`user:${id}:data`);

//       return updatedUser;
//     } catch (error: unknown) {
//       const message =
//         error instanceof Error
//           ? `Erro ao fazer upload do arquivo: ${error.message}`
//           : 'Erro desconhecido ao fazer upload do arquivo';

//       throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'src/infra/cache/redis/redis.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CloudflareR2Service } from 'src/infra/providers/storage/storage-r2';

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
    private readonly cloudflareR2: CloudflareR2Service,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
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

    // Define bucket e base da URL pública
    const bucketName = 'avatars';
    const publicUrlBase = process.env.R2_PUBLIC_URL_AVATARS;

    if (!publicUrlBase) {
      throw new HttpException(
        'URL pública do bucket avatars não configurada.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Determina a extensão do arquivo
    const fileExtension =
      file.filename?.split('.').pop() ?? file.mimetype?.split('/').pop() ?? '';

    // Gera nome único com timestamp para evitar cache
    const timestamp = Date.now();
    const fileName = `${id}-avatar-${timestamp}${fileExtension ? '.' + fileExtension : ''}`;

    try {
      // OPERAÇÕES EM PARALELO - R2 suporta requisições concorrentes
      const operations: Promise<any>[] = [];

      // Remove o avatar anterior (se existir) em paralelo
      if (user.avatar_filename) {
        const deleteOperation = this.cloudflareR2
          .deleteFile(user.avatar_filename, bucketName)
          .catch((deleteError) => {
            console.warn('Erro ao deletar avatar anterior:', deleteError);
            // Não falha se não conseguir deletar o anterior
          });
        operations.push(deleteOperation);
      }

      // Upload do novo arquivo em paralelo
      const uploadOperation = this.cloudflareR2.uploadFile(
        fileName,
        file.buffer,
        file.mimetype,
        bucketName,
      );
      operations.push(uploadOperation);

      // Executa ambas operações em paralelo
      await Promise.allSettled(operations);

      const publicUrl = `${publicUrlBase}/${fileName}`;

      // Sempre atualiza pois o nome do arquivo sempre muda
      const updatedUser = await this.prisma.userData.update({
        where: { usersId: id },
        data: {
          avatar_url: publicUrl,
          avatar_filename: fileName,
        },
      });

      // Limpa o cache do usuário no Redis
      await this.redisService.del(`user:${id}:data`);

      return updatedUser;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? `Erro ao fazer upload do arquivo: ${error.message}`
          : 'Erro desconhecido ao fazer upload do arquivo';

      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
