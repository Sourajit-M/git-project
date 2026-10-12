import { Redis } from 'ioredis';
import { ENV } from './env.js';

export const redis = new Redis(ENV.REDIS_URL, {
  maxRetriesPerRequest: 2,
  retryStrategy(times: number) {
    if (times > 3) {
      console.warn('⚠️ [Redis] Max retries reached. Running without Redis cache.');
      return null;
    }
    return Math.min(times * 100, 2000);
  },
  lazyConnect: true,
});

redis.on('connect', () => {
  console.log('✅ [Redis] Connected successfully to Docker Redis instance.');
});

redis.on('error', (err: Error) => {
  console.warn('⚠️ [Redis] Connection warning:', err.message);
});

// Initial connection attempt
redis.connect().catch((err: Error) => {
  console.warn('⚠️ [Redis] Could not connect initially:', err.message);
});
