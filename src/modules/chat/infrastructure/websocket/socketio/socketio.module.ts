import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketIOService } from './socketio.service';
import { WebSocketService } from 'src/modules/chat/application/ports/websocket.service';
import { ChatroomUserEntity } from '../../persistence/orm/entities/chatroom_user.entity';
import { SocketOnlineIdsStorage } from 'src/modules/chat/application/ports/socket-online-ids.storage';
import { RedisSocketOnlineIdsStorageModule } from '../../socket-online-ids-storage/redis/redis-socket-online-ids-storage.module';

@Module({
  imports: [
    RedisSocketOnlineIdsStorageModule,
    TypeOrmModule.forFeature([ChatroomUserEntity]),
  ],
  providers: [
    {
      provide: WebSocketService,
      useClass: SocketIOService,
    },
  ],
  exports: [WebSocketService],
})
export class SocketIOModule {}
