import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SentMessageEvent } from '../../domain/events/sent-message.event';
import { Logger } from '@nestjs/common';
import { CreateChatroomRepository } from '../ports/create-chatroom.repository';
import { Message } from '../../domain/message';
import { UpsertMaterializedChatroomRespository } from '../ports/upsert-materialized-chatroom.respository';
import { UpsertMaterializedMessageRespository } from '../ports/upsert-materialized-message.respository';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { WebSocketService } from '../ports/websocket.service';
import { UpdateChatroomUserRepository } from '../ports/update-chatroom-user';
import { ChatroomUser } from '../../domain/chatroom-user';

@EventsHandler(SentMessageEvent)
export class SentMessageEventHandler
  implements IEventHandler<SentMessageEvent>
{
  private readonly logger = new Logger(SentMessageEventHandler.name);

  constructor(
    private readonly upsertMaterializedChatroomRepository: UpsertMaterializedChatroomRespository,
    private readonly upsertMaterializedMessageRepository: UpsertMaterializedMessageRespository,
    private readonly updateChatroomUserRepository: UpdateChatroomUserRepository,
    private readonly webSocketService: WebSocketService,
  ) {}

  async handle(event: SentMessageEvent): Promise<void> {
    this.logger.log(`Sent message event: ${JSON.stringify(event.message)}`);

    // * 同步資料到 read db
    // * 更新聊天室最新說的話
    await this.upsertMaterializedChatroomRepository.upsert({
      id: event.message.chatroomId,
      newMessage: event.message,
    });
    // * 新增聊天記錄
    await this.upsertMaterializedMessageRepository.upsert(event.message);

    // * websocket 通知給有在線的人
    const { chatroomId, senderId, image, content, id, createdAt } =
      event.message;
    this.webSocketService.brocastToChatroom('message', chatroomId, {
      id,
      chatroomId,
      senderId,
      image,
      content,
      createdAt,
    });
    this.webSocketService.brocastToChatroom('chatroomNewMessage', chatroomId, {
      id,
      chatroomId,
      senderId,
      image,
      content,
      createdAt,
    });
  }
}
