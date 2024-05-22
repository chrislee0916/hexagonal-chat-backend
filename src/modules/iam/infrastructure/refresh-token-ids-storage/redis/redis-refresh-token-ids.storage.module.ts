import { Module } from '@nestjs/common';
import { RefreshTokenIdsStorage } from 'src/modules/iam/application/ports/refresh-token-ids.storage';
import { RedisRefreshTokenIdsStorage } from './redis-refresh-token-ids-storage';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    {
      provide: RefreshTokenIdsStorage,
      useClass: RedisRefreshTokenIdsStorage,
    },
    {
      provide: JwtService,
      useClass: JwtService,
    },
  ],
  exports: [RefreshTokenIdsStorage],
})
export class RedisRefreshTokenIdsStorageModule {}
