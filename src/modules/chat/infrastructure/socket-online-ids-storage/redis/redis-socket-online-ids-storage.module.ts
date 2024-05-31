import { Module } from '@nestjs/common';
import { SocketOnlineIdsStorage } from 'src/modules/chat/application/ports/socket-online-ids.storage';
import { RedisSocketOnlineIdsStorage } from './socket-online-ids.storage';

@Module({
  providers: [
    {
      provide: SocketOnlineIdsStorage,
      useClass: RedisSocketOnlineIdsStorage,
    },
  ],
  exports: [SocketOnlineIdsStorage],
})
export class RedisSocketOnlineIdsStorageModule {}
