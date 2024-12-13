import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Supabase } from 'src/infra/providers/storage/storage-supabase';

@Injectable()
export class DeleteAvatarUseCase {
  constructor(
    private readonly supabase: Supabase,
    private readonly prisma: PrismaService,
  ) {}

  async deleteAvatar(file: string, id: string): Promise<any> {
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
      // console.log('File deleted successfully:', data);
    } catch (error) {
      //
      if (error instanceof Error) {
        console.error('Error deleting file:', error.message);
      } else {
        console.error('error:', error);
      }
    }
  }
}
