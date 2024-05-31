import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketOnlineIdsStorage } from 'src/modules/chat/application/ports/socket-online-ids.storage';

export class RedisSocketOnlineIdsStorage implements SocketOnlineIdsStorage {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async signIn(userId: number, socketId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), socketId);
  }

  async getSocketId(userId: number): Promise<string> {
    return this.redisClient.get(this.getKey(userId));
  }

  async signOut(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `socket-${userId}`;
  }
}
