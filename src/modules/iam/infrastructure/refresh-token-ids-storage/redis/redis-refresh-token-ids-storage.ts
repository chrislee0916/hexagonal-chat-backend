import { Inject, OnApplicationShutdown } from "@nestjs/common";
import { RefreshTokenIdsStorage } from "src/modules/iam/application/ports/refresh-token-ids.storage";
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

export class RedisRefreshTokenIdsStorage implements RefreshTokenIdsStorage, OnApplicationShutdown {
  constructor(@InjectRedis() private readonly redisClient: Redis
  ) { }

  async onApplicationShutdown(signal?: string) {
    return this.redisClient.quit()
  }

  async insert(userId: number, tokenId: string): Promise<void> {
    let res = await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));
    if (storedId !== tokenId) {
      throw new Error('Invalidated refresh token');
    }
    return storedId === tokenId
  }

  async invalidate(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }

}