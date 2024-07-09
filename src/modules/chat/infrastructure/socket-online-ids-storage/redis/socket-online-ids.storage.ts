import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketOnlineIdsStorage } from 'src/modules/chat/application/ports/socket-online-ids.storage';

export class RedisSocketOnlineIdsStorage implements SocketOnlineIdsStorage {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async signIn(userId: number, socketId: string): Promise<void> {
    await this.redisClient.set(this.getSocketUserKey(userId), socketId);
    await this.redisClient.set(this.getSocketKey(socketId), userId);
  }

  async getSocketId(userId: number): Promise<string> {
    return this.redisClient.get(this.getSocketUserKey(userId));
  }

  async getUserId(socketId: string): Promise<string> {
    return this.redisClient.get(this.getSocketKey(socketId));
  }

  async signOut(socketId: string): Promise<void> {
    const userId = await this.getUserId(socketId);
    console.log('disconnect userId: ', userId);
    console.log('disconnect socketId: ', socketId);
    if (userId) {
      await this.redisClient.del(this.getSocketUserKey(+userId));
    }
    await this.redisClient.del(this.getSocketKey(socketId));
  }

  private getSocketKey(socketId: string): string {
    return `socket-${socketId}`;
  }

  private getSocketUserKey(userId: number): string {
    return `socket-user-${userId}`;
  }
}
