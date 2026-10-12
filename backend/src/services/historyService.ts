import { prisma } from '../config/prisma.js';
import { redisCacheService } from './redisCacheService.js';

export const historyService = {
  async getOrCreateDemoUser() {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: 'gh-demo-999',
          username: 'sourav-dev',
          name: 'Sourav Roy',
          email: 'sourav.dev@example.com',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          accessToken: 'demo_token',
        },
      });
    }
    return user;
  },

  async recordHistory(params: {
    type: 'commit' | 'pr' | 'release';
    repoName?: string;
    inputSnippet?: string;
    title: string;
    output: string;
    modelUsed: string;
    cachedInRedis?: boolean;
    userId?: string;
  }) {
    try {
      let userId = params.userId;
      if (!userId) {
        const defaultUser = await this.getOrCreateDemoUser();
        userId = defaultUser.id;
      }

      const inputHash = redisCacheService.hashInput(params.inputSnippet || params.title);

      return await prisma.generationHistory.create({
        data: {
          userId,
          type: params.type,
          repoName: params.repoName,
          inputHash,
          inputSnippet: params.inputSnippet?.slice(0, 5000),
          title: params.title,
          output: params.output,
          modelUsed: params.modelUsed,
          cachedInRedis: Boolean(params.cachedInRedis),
        },
      });
    } catch (err: any) {
      console.warn('⚠️ [Prisma] Could not record history to PostgreSQL:', err.message);
      return null;
    }
  },

  async getHistory(userId?: string, type?: string, limit = 20) {
    try {
      const where: any = {};
      if (userId) where.userId = userId;
      if (type && type !== 'all') where.type = type;

      const items = await prisma.generationHistory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return items.map((i) => ({
        id: i.id,
        type: i.type,
        title: i.title,
        preview: i.output.slice(0, 200),
        timestamp: i.createdAt.toISOString(),
        cached: i.cachedInRedis,
        repoName: i.repoName || 'general',
        fullOutput: i.output,
      }));
    } catch (err: any) {
      console.warn('⚠️ [Prisma] Could not fetch history:', err.message);
      return [];
    }
  },

  async deleteHistoryItem(id: string) {
    try {
      await prisma.generationHistory.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  async clearAllHistory(userId?: string) {
    try {
      if (userId) {
        await prisma.generationHistory.deleteMany({ where: { userId } });
      } else {
        await prisma.generationHistory.deleteMany();
      }
      return true;
    } catch {
      return false;
    }
  },
};
