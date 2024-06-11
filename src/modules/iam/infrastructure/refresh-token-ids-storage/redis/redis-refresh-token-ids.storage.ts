import { Inject, OnApplicationShutdown } from '@nestjs/common';
import { RefreshTokenIdsStorage } from 'src/modules/iam/application/ports/refresh-token-ids.storage';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/iam/domain/user';
import { randomUUID } from 'crypto';
import { ActiveUserData } from 'src/modules/iam/domain/interfaces/active-user-data.interface';
import { Tokens } from 'src/modules/iam/domain/interfaces/tokens.interface';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';

export class RedisRefreshTokenIdsStorage
  implements RefreshTokenIdsStorage, OnApplicationShutdown
{
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async onApplicationShutdown(signal?: string) {
    await this.redisClient.reset();
    return this.redisClient.quit();
  }

  async insert(userId: number, tokenId: string): Promise<void> {
    let res = await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));
    return storedId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }

  async generateTokens(user: UserReadModel): Promise<Tokens> {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        +process.env.JWT_ACCESS_TOKEN_TTL,
        { email: user.email },
      ),
      // TODO: 應該使用強型別
      this.signToken(user.id, +process.env.JWT_REFRESH_TOKEN_TTL, {
        refreshTokenId,
      }),
    ]);

    await this.insert(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        expiresIn,
      },
    );
  }
}
