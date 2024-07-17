import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreatedChatroomEvent } from '../../domain/events/created-chatroom.event';
import { Logger } from '@nestjs/common';
import { UpsertMaterializedChatroomRespository } from '../ports/upsert-materialized-chatroom.respository';
import { UpsertMaterializedUserRepository } from 'src/modules/iam/application/ports/upsert-materialized-user.repository';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { ChatGateway } from '../../presenters/websocket/chat.gateway';
import { WebSocketService } from '../ports/websocket.service';

@EventsHandler(CreatedChatroomEvent)
export class CreatedChatroomEventHandler
  implements IEventHandler<CreatedChatroomEvent>
{
  private readonly logger = new Logger(CreatedChatroomEventHandler.name);

  constructor(
    private readonly upsertMaterializedChatroomRepository: UpsertMaterializedChatroomRespository,
    private readonly upsertMaterializedUserRepository: UpsertMaterializedUserRepository,
    private readonly webSocketService: WebSocketService,
  ) {}

  async handle(event: CreatedChatroomEvent): Promise<void> {
    this.logger.log(`Created chatroom event: ${JSON.stringify(event)}`);
    const userIds = event.chatroom.users.flatMap((user) => user.userId);
    // * 同步資料到 read db
    await this.upsertMaterializedChatroomRepository.upsert(event.chatroom);
    // await this.upsertMaterializedUserRepository.upsertChatrooms(userIds);

    // * socket 通知其他被加入的的使用者
    await this.webSocketService.joinChatroom(event.chatroom.id, userIds);
    await this.webSocketService.brocastToChatroom(
      'createChatroom',
      event.chatroom.id,
      {
        id: event.chatroom.id,
        name: event.chatroom.name,
        image: event.chatroom.image,
      },
    );
  }
}
