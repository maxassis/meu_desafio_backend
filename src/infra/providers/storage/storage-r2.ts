// import { Injectable } from '@nestjs/common';
// import {
//   S3Client,
//   PutObjectCommand,
//   DeleteObjectCommand,
//   GetObjectCommand,
// } from '@aws-sdk/client-s3';

// @Injectable()
// export class CloudflareR2Service {
//   private readonly s3Client: S3Client;
//   private readonly bucketName = process.env.R2_BUCKET_NAME;
//   private readonly publicDomain: string;

//   constructor() {
//     this.bucketName = process.env.R2_BUCKET_NAME as string;
//     this.publicDomain = process.env.R2_PUBLIC_URL as string;

//     // Validar se as variáveis de ambiente estão definidas
//     if (!this.bucketName) {
//       throw new Error('CLOUDFLARE_R2_BUCKET_NAME não está definido');
//     }
//     if (!process.env.R2_ACCOUNT_ID) {
//       throw new Error('CLOUDFLARE_ACCOUNT_ID não está definido');
//     }
//     if (!process.env.R2_ACCESS_KEY_ID) {
//       throw new Error('CLOUDFLARE_R2_ACCESS_KEY_ID não está definido');
//     }
//     if (!process.env.R2_SECRET_ACCESS_KEY) {
//       throw new Error('CLOUDFLARE_R2_SECRET_ACCESS_KEY não está definido');
//     }

//     this.s3Client = new S3Client({
//       region: 'auto',
//       endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//       credentials: {
//         accessKeyId: process.env.R2_ACCESS_KEY_ID,
//         secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
//       },
//       forcePathStyle: true,
//       tls: true,
//       requestHandler: {
//         requestTimeout: 30000,
//         httpsAgent: {
//           keepAlive: true,
//           rejectUnauthorized: true,
//         },
//       },
//     });
//   }

//   async uploadFile(
//     key: string,
//     buffer: Buffer,
//     contentType: string,
//   ): Promise<any> {
//     try {
//       const command = new PutObjectCommand({
//         Bucket: this.bucketName,
//         Key: key,
//         Body: buffer,
//         ContentType: contentType,
//       });

//       const result = await this.s3Client.send(command);
//       return result;
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error('Erro ao deletar arquivo do R2:', {
//           key,
//           bucket: this.bucketName,
//           error: error.message,
//         });
//         throw new Error(`Falha ao deletar arquivo: ${error.message}`);
//       } else {
//         console.error('Erro desconhecido ao deletar arquivo do R2:', {
//           key,
//           bucket: this.bucketName,
//         });
//         throw new Error('Erro desconhecido ao deletar arquivo');
//       }
//     }
//   }

//   async deleteFile(key: string): Promise<any> {
//     try {
//       const command = new DeleteObjectCommand({
//         Bucket: this.bucketName,
//         Key: key,
//       });

//       const result = await this.s3Client.send(command);
//       return result;
//     } catch (error: any) {
//       console.error('Erro ao deletar arquivo do R2:', {
//         key,
//         bucket: this.bucketName,
//         error: error.message,
//       });
//       throw new Error(`Falha ao deletar arquivo: ${error.message}`);
//     }
//   }

//   async getFile(key: string): Promise<any> {
//     const command = new GetObjectCommand({
//       Bucket: this.bucketName,
//       Key: key,
//     });

//     return await this.s3Client.send(command);
//   }

//   getPublicUrl(key: string): string {
//     if (this.publicDomain) {
//       return `${this.publicDomain}/${key}`;
//     }
//     // Fallback para URL padrão do R2 (se configurado para público)
//     return `https://${this.bucketName}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
//   }
// }

import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class CloudflareR2Service {
  private readonly s3Client: S3Client;
  private readonly publicDomain: string;

  constructor() {
    this.publicDomain = process.env.R2_PUBLIC_URL as string;

    // Validação das variáveis
    if (!process.env.R2_ACCOUNT_ID) {
      throw new Error('R2_ACCOUNT_ID não está definido');
    }
    if (!process.env.R2_ACCESS_KEY_ID) {
      throw new Error('R2_ACCESS_KEY_ID não está definido');
    }
    if (!process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error('R2_SECRET_ACCESS_KEY não está definido');
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
    bucket: string, // bucket opcional
  ): Promise<string> {;

    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      return this.getPublicUrl(key, bucket); // Passa o bucket aqui também
    } catch (error: any) {
      console.error('Erro ao fazer upload no R2:', {
        key,
        bucket: bucket,
        error: error.message,
      });
      throw new Error(`Falha ao fazer upload: ${error.message}`);
    }
  }

  async deleteFile(key: string, bucket: string): Promise<any> {

    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      return await this.s3Client.send(command);
    } catch (error: any) {
      console.error('Erro ao deletar arquivo do R2:', {
        key,
        bucket: bucket,
        error: error.message,
      });
      throw new Error(`Falha ao deletar arquivo: ${error.message}`);
    }
  }

  getPublicUrl(key: string, bucket: string): string {
    const activeBucket = bucket

    if (this.publicDomain) {
      return `${this.publicDomain}/${key}`;
    }

    return `https://${activeBucket}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
  }
}
