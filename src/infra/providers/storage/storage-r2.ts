import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class CloudflareR2Service {
  private readonly s3Client: S3Client;
  private readonly bucketUrlMap: Record<string, string>;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    if (!accountId) throw new Error('R2_ACCOUNT_ID não está definido');
    if (!process.env.R2_ACCESS_KEY_ID)
      throw new Error('R2_ACCESS_KEY_ID não está definido');
    if (!process.env.R2_SECRET_ACCESS_KEY)
      throw new Error('R2_SECRET_ACCESS_KEY não está definido');

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });

    this.bucketUrlMap = {
      avatars: process.env.R2_PUBLIC_URL_AVATARS as string,
      desafios: process.env.R2_PUBLIC_URL_DESAFIOS as string,
    };
  }

  async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
    bucket: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      return this.getPublicUrl(key, bucket);
    } catch (error: any) {
      console.error('Erro ao fazer upload no R2:', {
        key,
        bucket,
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
        bucket,
        error: error.message,
      });
      throw new Error(`Falha ao deletar arquivo: ${error.message}`);
    }
  }

  getPublicUrl(key: string, bucket: string): string {
    const bucketUrl = this.bucketUrlMap[bucket];

    if (bucketUrl) {
      return `${bucketUrl}/${key}`;
    }

    // Fallback padrão do R2
    const accountId = process.env.R2_ACCOUNT_ID;
    return `https://${bucket}.${accountId}.r2.cloudflarestorage.com/${key}`;
  }
}
