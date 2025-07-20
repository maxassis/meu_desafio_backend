import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { randomUUID } from 'crypto';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';
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
    private readonly supabase: Supabase,
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
    // console.log('Files received:', files);

    // Verifica se já existe um desafio com o mesmo nome
    const desafioExists = await this.prisma.desafio.findFirst({
      where: { name },
    });

    if (desafioExists) {
      throw new HttpException('Name already exists', HttpStatus.CONFLICT);
    }

    // Array para armazenar URLs das imagens
    const imageUrls: string[] = [];

    // Faz upload de todas as imagens
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const fileName = `${randomUUID()}-${file.originalname}`;

          // Upload da imagem para o Supabase
          const { error } = await this.supabase.client.storage
            .from('desafios')
            .upload(fileName, file.buffer, {
              contentType: file.mimetype,
            });

          if (error) {
            // console.error('Supabase upload error:', error);
            throw new HttpException(
              `Error uploading image ${file.originalname} to Supabase: ${error.message}`,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }

          // Obtém a URL pública da imagem
          const { data: dataUrl } = this.supabase.client.storage
            .from('desafios')
            .getPublicUrl(fileName);

          imageUrls.push(dataUrl.publicUrl);
        } catch (error) {
          // console.error('Error processing file:', file.originalname, error);
          throw new HttpException(
            `Error processing file ${file.originalname}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }

    // Adiciona as URLs das imagens ao purchaseData
    const updatedPurchaseData = {
      ...purchaseData,
      distance,
      images: imageUrls,
    };

    // Define a foto principal (primeira imagem ou string vazia)
    const mainPhoto = imageUrls.length > 0 ? imageUrls[1] : '';

    try {
      // Cria o desafio no banco de dados
      const result = await this.prisma.desafio.create({
        data: {
          name,
          location: location,
          distance,
          photo: mainPhoto,
          purchaseData: updatedPurchaseData,
          priceId,
          active,
        },
      });

      // console.log('Desafio created successfully:', result.id);

      return {
        message: 'Desafio created successfully',
        id: result.id,
        imagesUploaded: imageUrls.length,
        mainPhoto: mainPhoto,
      };
    } catch (error) {
      // console.error('Database error:', error);

      // Em caso de erro na criação do desafio, tenta limpar as imagens já enviadas
      if (imageUrls.length > 0) {
        // console.log('Attempting to cleanup uploaded images...');
        await this.cleanupUploadedImages(imageUrls);
      }

      throw new HttpException(
        'Error creating desafio in database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Método auxiliar para limpar imagens em caso de erro
  private async cleanupUploadedImages(imageUrls: string[]) {
    for (const url of imageUrls) {
      try {
        // Extrai o nome do arquivo da URL
        const fileName = url.split('/').pop();
        if (fileName) {
          await this.supabase.client.storage
            .from('desafios')
            .remove([fileName]);
        }
      } catch (error) {
        console.error('Error cleaning up image:', url, error);
        // Não lança erro para não mascarar o erro original
      }
    }
  }
}
