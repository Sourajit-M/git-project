import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { redis } from '../config/redis.js';
import { ENV } from '../config/env.js';

export const healthController = {
  async getHealth(req: Request, res: Response) {
    let dbStatus = 'down';
    let redisStatus = 'down';

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch {
      dbStatus = 'down';
    }

    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        const ping = await redis.ping();
        if (ping === 'PONG') redisStatus = 'up';
      }
    } catch {
      redisStatus = 'down';
    }

    const isHealthy = dbStatus === 'up';

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          type: 'PostgreSQL 16 (Docker)',
          status: dbStatus,
        },
        cache: {
          type: 'Redis 7 (Docker)',
          status: redisStatus,
        },
        ai: {
          provider: 'Groq Cloud',
          model: ENV.GROQ_MODEL,
          status: ENV.GROQ_API_KEY ? 'active' : 'fallback-mode',
        },
      },
    });
  },
};
