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

//     // Remove avatar antigo se existir
//     if (user.avatar_filename) {
//       try {
//         await this.cloudflareR2.deleteFile(user.avatar_filename);
//       } catch (error: unknown) {
//         throw new HttpException(
//           `Erro ao remover avatar antigo: ${(error as Error).message}`,
//           HttpStatus.INTERNAL_SERVER_ERROR,
//         );
//       }
//     }

//     // Determina a extensão do arquivo
//     let fileExtension = '';
//     if (file.filename) {
//       fileExtension = file.filename.split('.').pop() || '';
//     } else if (file.mimetype) {
//       fileExtension = file.mimetype.split('/').pop() || '';
//     }

//     const newFileName = `${id}-${Date.now()}${fileExtension ? '.' + fileExtension : ''}`;

//     // Upload do novo arquivo
//     try {
//       await this.cloudflareR2.uploadFile(
//         newFileName,
//         file.buffer,
//         file.mimetype,
//       );

//       // Gera URL pública
//       const publicUrl = this.cloudflareR2.getPublicUrl(newFileName);
//       console.log('URL gerada:', publicUrl);

//       const updatedUser = await this.prisma.userData.update({
//         where: { usersId: id },
//         data: {
//           avatar_url: publicUrl,
//           avatar_filename: newFileName,
//         },
//       });

//       await this.redisService.del(`user:${id}:data`);

//       return updatedUser;
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new HttpException(
//           `Erro ao fazer upload do arquivo: ${error.message}`,
//           HttpStatus.INTERNAL_SERVER_ERROR,
//         );
//       } else {
//         throw new HttpException(
//           'Erro desconhecido ao fazer upload do arquivo',
//           HttpStatus.INTERNAL_SERVER_ERROR,
//         );
//       }
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

    // Determina a extensão do arquivo
    let fileExtension = '';
    if (file.filename) {
      fileExtension = file.filename.split('.').pop() || '';
    } else if (file.mimetype) {
      fileExtension = file.mimetype.split('/').pop() || '';
    }

    // 🎯 SEMPRE USA O MESMO NOME - sobrescreve automaticamente
    const fileName = `${id}-avatar${fileExtension ? '.' + fileExtension : ''}`;

    try {
      // 1️⃣ Upload sobrescreve o arquivo existente automaticamente
      await this.cloudflareR2.uploadFile(fileName, file.buffer, file.mimetype);

      // 2️⃣ Gera URL pública (sempre a mesma)
      const publicUrl = this.cloudflareR2.getPublicUrl(fileName);

      // 3️⃣ Atualiza apenas se mudou (primeira vez ou extensão diferente)
      const needsUpdate =
        !user.avatar_filename || user.avatar_filename !== fileName;

      let updatedUser = user;
      if (needsUpdate) {
        updatedUser = await this.prisma.userData.update({
          where: { usersId: id },
          data: {
            avatar_url: publicUrl,
            avatar_filename: fileName,
          },
        });
      }

      // 4️⃣ Invalida o cache (sempre, porque a imagem mudou)
      await this.redisService.del(`user:${id}:data`);

      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          `Erro ao fazer upload do arquivo: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'Erro desconhecido ao fazer upload do arquivo',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
