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
    const cacheKey = `user:profile:${id}`;

    const cachedProfile = await this.redisService.get(cacheKey);
    if (cachedProfile) {
      return JSON.parse(cachedProfile);
    }

    // 2️⃣ Busca no banco
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

    const completedChallengesList = await this.prisma.inscription.findMany({
      where: { userId: id, completed: true },
      select: {
        completedAt: true,
        desafio: {
          select: {
            id: true,
            name: true,
            distance: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
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

    const completedChallenges = completedChallengesList.map((insc) => ({
      id: insc.desafio.id,
      name: insc.desafio.name,
      totalDistance: Number(insc.desafio.distance),
      completedAt: insc.completedAt,
    }));

    const profile = {
      name: userData.user.name,
      avatarUrl: userData.avatar_url,
      fullName: userData.full_name,
      bio: userData.bio,
      activeInscriptions: activeCount,
      completedChallengesCount: completedCount,
      completedChallenges,
      totalDistance: Number(totalKmObj._sum.distanceKm ?? 0),
      recentTasks,
      activeChallenges,
    };

    await this.redisService.set(cacheKey, JSON.stringify(profile), 'EX', 300);

    return profile;
  }
}
