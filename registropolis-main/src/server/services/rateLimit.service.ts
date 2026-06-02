
import { getMainRedisClient } from '../db/redis';
import { RateLimitError } from './errors.service';

export class RateLimitService {
  private static async incrementAndGet(key: string, expirySeconds: number): Promise<number> {
    const redis = getMainRedisClient();
    const count = await redis.incr(key);
    
    // Set expiry only on first request
    if (count === 1) {
      await redis.expire(key, expirySeconds);
    }
    
    return count;
  }

  static async checkOTPLimit(phoneNumber: string): Promise<void> {
    const redis = getMainRedisClient();
    const key = `otplimit:${phoneNumber}`;
    const maxAttempts = 5; // Max 5 attempts
    const windowSeconds = 3600; // 1 hour window
    
    const attempts = await this.incrementAndGet(key, windowSeconds);
    
    if (attempts > maxAttempts) {
      const ttl = await redis.ttl(key);
      throw new RateLimitError(ttl);
    }
  }
}
