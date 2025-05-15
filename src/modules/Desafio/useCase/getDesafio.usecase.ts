import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class GetDesafioUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getDesafio(idDesafio: string) {
    const desafio = await this.prisma.desafio.findUnique({
      where: { id: +idDesafio },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        distance: true,
        photo: true,
        inscription: {
          where: {
            completed: false,
          },
          select: {
            progress: true,
            user: {
              select: {
                id: true,
                name: true,
                UserData: {
                  select: {
                    avatar_url: true,
                  },
                },
              },
            },
            _count: {
              select: {
                tasks: true, // totalTasks
              },
            },
            tasks: {
              select: {
                calories: true,
                distanceKm: true,
              },
            },
          },
        },
      },
    });

    if (!desafio) {
      throw new NotFoundException(`Desafio with ID ${idDesafio} not found`);
    }

    const inscriptionsWithStats = desafio.inscription.map((inscription) => {
      const totalCalories = inscription.tasks.reduce(
        (sum, task) => sum + (task.calories ?? 0),
        0,
      );
      const totalDistanceKm = inscription.tasks.reduce(
        (sum, task) => sum + task.distanceKm.toNumber(),
        0,
      );

      return {
        user: inscription.user,
        progress: inscription.progress,
        totalTasks: inscription._count.tasks,
        totalCalories,
        totalDistanceKm,
      };
    });

    return {
      id: desafio.id,
      name: desafio.name,
      description: desafio.description,
      location: desafio.location,
      distance: desafio.distance,
      photo: desafio.photo,
      inscription: inscriptionsWithStats,
    };
  }
}
