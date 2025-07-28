import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { randomUUID } from 'crypto';
import { CloudflareR2Service } from 'src/infra/providers/storage/storage-r2';
import { PurchaseDataSchema } from '../schemas';
import { z } from 'zod';

interface MulterLikeFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

type PurchaseData = z.infer<typeof PurchaseDataSchema>;

@Injectable()
export class CreateDesafioUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudflareR2: CloudflareR2Service,
  ) {}

  async createDesafio(
    name: string,
    location: Array<{ latitude: number; longitude: number }>,
    distance: number,
    active: boolean,
    priceId: string,
    purchaseData: PurchaseData,
    files: MulterLikeFile[],
  ) {
    const bucketName = 'desafios';

    const desafioExists = await this.prisma.desafio.findFirst({
      where: { name },
    });

    if (desafioExists) {
      throw new HttpException('Name already exists', HttpStatus.CONFLICT);
    }

    const imageUrls: string[] = [];
    const uploadedFileNames: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const fileName = `${randomUUID()}-${file.originalname}`;

          // Use o método uploadFile que já retorna a URL pública correta
          const publicUrl = await this.cloudflareR2.uploadFile(
            fileName,
            file.buffer,
            file.mimetype,
            bucketName,
          );

          uploadedFileNames.push(fileName);
          imageUrls.push(publicUrl); // Use a URL retornada pelo uploadFile
        } catch (error) {
          console.error('Error processing file:', file.originalname, error);
          await this.cleanupUploadedImages(uploadedFileNames, bucketName);
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          throw new HttpException(
            `Error processing file ${file.originalname}: ${errorMessage}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }

    const updatedPurchaseData = {
      ...purchaseData,
      distance,
      images: imageUrls,
    };

    const mainPhoto = imageUrls.length > 0 ? imageUrls[0] : '';

    try {
      const result = await this.prisma.desafio.create({
        data: {
          name,
          location,
          distance,
          photo: mainPhoto,
          purchaseData: updatedPurchaseData,
          priceId,
          active,
        },
      });

      return {
        message: 'Desafio created successfully',
        id: result.id,
        imagesUploaded: imageUrls.length,
        mainPhoto,
        imageUrls,
      };
    } catch (error) {
      console.error('Database error:', error);
      if (uploadedFileNames.length > 0) {
        console.log('Attempting to cleanup uploaded images...');
        await this.cleanupUploadedImages(uploadedFileNames, bucketName);
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown database error';
      throw new HttpException(
        `Error creating desafio in database: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async cleanupUploadedImages(fileNames: string[], bucketName: string) {
    for (const fileName of fileNames) {
      try {
        await this.cloudflareR2.deleteFile(fileName, bucketName);
        console.log(`Successfully cleaned up file: ${fileName}`);
      } catch (error) {
        console.error('Error cleaning up image:', fileName, error);
      }
    }
  }
}
