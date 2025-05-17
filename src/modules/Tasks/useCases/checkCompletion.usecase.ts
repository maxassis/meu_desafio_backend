import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class CheckCompletionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async checkCompletion(
    userId: string,
    inscriptionId: number,
    distanceCovered: number,
  ) {
    try {
      const inscription = await this.prisma.inscription.findFirst({
        where: {
          id: inscriptionId,
          userId: userId,
        },
        include: {
          desafio: true,
        },
      });

      if (!inscription) {
        throw new Error('Inscription not found or does not belong to the user');
      }

      const currentProgress = Number(inscription.progress);
      const totalProgress = currentProgress + distanceCovered;

      const challengeDistance = Number(inscription.desafio.distance);

      const willCompleteChallenge = totalProgress >= challengeDistance;

      return {
        willCompleteChallenge,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to check completion: ${error.message}`);
      } else {
        throw new Error(`An unknown error occurred: ${String(error)}`);
      }
    }
  }
}
