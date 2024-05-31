import { Module } from '@nestjs/common';
import { OrmChatPersistenceModule } from './persistence/orm/orm-persistence.module';
import { RedisSocketOnlineIdsStorageModule } from './socket-online-ids-storage/redis/redis-socket-online-ids-storage.module';

@Module({})
export class ChatInfrastrucutureModule {
  static use(driver: 'orm') {
    return {
      module: ChatInfrastrucutureModule,
      imports: [OrmChatPersistenceModule, RedisSocketOnlineIdsStorageModule],
      exports: [OrmChatPersistenceModule, RedisSocketOnlineIdsStorageModule],
    };
  }
}
