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

//     // Determina a extensão do arquivo
//     let fileExtension = '';
//     if (file.filename) {
//       fileExtension = file.filename.split('.').pop() || '';
//     } else if (file.mimetype) {
//       fileExtension = file.mimetype.split('/').pop() || '';
//     }

//     const fileName = `${id}-avatar${fileExtension ? '.' + fileExtension : ''}`;

//     try {
//       await this.cloudflareR2.uploadFile(fileName, file.buffer, file.mimetype);

//       const publicUrl = this.cloudflareR2.getPublicUrl(fileName);

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

//     // Determina a extensão do arquivo
//     let fileExtension = '';
//     if (file.filename) {
//       fileExtension = file.filename.split('.').pop() || '';
//     } else if (file.mimetype) {
//       fileExtension = file.mimetype.split('/').pop() || '';
//     }

//     const fileName = `${id}-avatar${fileExtension ? '.' + fileExtension : ''}`;
//     const bucketName = 'avatars'; // ✅ Define bucket específico

//     try {
//       await this.cloudflareR2.uploadFile(
//         fileName,
//         file.buffer,
//         file.mimetype,
//         bucketName, // ✅ bucket passado dinamicamente
//       );

//       const publicUrl = this.cloudflareR2.getPublicUrl(fileName, bucketName); // ✅ mesma coisa aqui

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
    const fileName = `${id}-avatar${fileExtension ? '.' + fileExtension : ''}`;

    try {
      await this.cloudflareR2.uploadFile(
        fileName,
        file.buffer,
        file.mimetype,
        bucketName,
      );

      const publicUrl = `${publicUrlBase}/${fileName}`;

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
