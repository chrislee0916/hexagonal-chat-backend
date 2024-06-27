import { Module } from '@nestjs/common';
import { OrmChatPersistenceModule } from './persistence/orm/orm-persistence.module';
import { RedisSocketOnlineIdsStorageModule } from './socket-online-ids-storage/redis/redis-socket-online-ids-storage.module';
import { SocketIOModule } from './websocket/socketio/socketio.module';
import { OrmIamPersistenceModule } from 'src/modules/iam/infrastructure/persistence/orm/orm-persistence.module';

@Module({})
export class ChatInfrastrucutureModule {
  static use(driver: 'orm') {
    return {
      module: ChatInfrastrucutureModule,
      imports: [
        OrmChatPersistenceModule,
        OrmIamPersistenceModule,
        RedisSocketOnlineIdsStorageModule,
        SocketIOModule,
      ],
      exports: [
        OrmIamPersistenceModule,
        OrmChatPersistenceModule,
        RedisSocketOnlineIdsStorageModule,
        SocketIOModule,
      ],
    };
  }
}
