import crypto from 'crypto';
import { redis } from '../config/redis.js';

export const redisCacheService = {
  hashInput(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      if (redis.status !== 'ready' && redis.status !== 'connect') return null;
      const cached = await redis.get(key);
      if (!cached) return null;

      // Sliding TTL: refresh expiration for 45 minutes on every cache hit
      await redis.expire(key, 45 * 60);
      return JSON.parse(cached) as T;
    } catch {
      return null;
    }
  },

  async set(key: string, value: any, ttlSeconds = 45 * 60): Promise<void> {
    try {
      if (redis.status !== 'ready' && redis.status !== 'connect') return;
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (err: any) {
      console.warn('⚠️ [Redis] Failed to write cache key:', key, err.message);
    }
  },
};
