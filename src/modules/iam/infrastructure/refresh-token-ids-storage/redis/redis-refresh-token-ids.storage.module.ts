import { Module } from "@nestjs/common";
import { RefreshTokenIdsStorage } from "src/modules/iam/application/ports/refresh-token-ids.storage";
import { RedisRefreshTokenIdsStorage } from "./redis-refresh-token-ids-storage";


@Module({
  providers: [
    {
      provide: RefreshTokenIdsStorage,
      useClass: RedisRefreshTokenIdsStorage
    },
  ],
  exports: [RefreshTokenIdsStorage]
})
export class RedisRefreshTokenIdsStorageModule { }