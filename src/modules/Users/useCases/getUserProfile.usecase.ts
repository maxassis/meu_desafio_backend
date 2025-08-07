import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RedisService } from 'src/infra/cache/redis/redis.service';

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getUserProfile(id: string) {
    // 1. Basic user info (avatar, name, etc.)
    const userData = await this.prisma.userData.findUnique({
      where: { usersId: id },
      select: {
        avatar_url: true,
        full_name: true,
        bio: true,
        user: {
          select: { name: true },
        },
      },
    });

    if (!userData) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 2. Count active inscriptions and completed challenges
    const [activeCount, completedCount, totalKmObj] = await Promise.all([
      this.prisma.inscription.count({
        where: { userId: id, completed: false },
      }),
      this.prisma.inscription.count({
        where: { userId: id, completed: true },
      }),
      this.prisma.task.aggregate({
        where: { usersId: id },
        _sum: { distanceKm: true },
      }),
    ]);

    // 3. Last 5 tasks
    const recentTasks = await this.prisma.task.findMany({
      where: { usersId: id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        environment: true,
        date: true,
        duration: true,
        calories: true,
        distanceKm: true,
        createdAt: true,
      },
    });

    // 4. Active challenges with distance covered
    const activeInscriptions = await this.prisma.inscription.findMany({
      where: {
        userId: id,
        desafio: { active: true },
      },
      select: {
        desafio: {
          select: {
            id: true,
            name: true,
            distance: true,
          },
        },
        tasks: {
          select: {
            distanceKm: true,
          },
        },
      },
    });

    const activeChallenges = activeInscriptions.map((insc) => ({
      id: insc.desafio.id,
      name: insc.desafio.name,
      totalDistance: Number(insc.desafio.distance),
      distanceCovered: insc.tasks.reduce(
        (sum, task) => sum + Number(task.distanceKm),
        0,
      ),
    }));

    // 5. Return final data
    return {
      name: userData.user.name,
      avatarUrl: userData.avatar_url,
      fullName: userData.full_name,
      bio: userData.bio,
      activeInscriptions: activeCount,
      completedChallenges: completedCount,
      totalDistance: Number(totalKmObj._sum.distanceKm ?? 0),
      recentTasks,
      activeChallenges,
    };
  }
}
