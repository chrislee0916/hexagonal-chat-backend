import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SentMessageEvent } from '../../domain/events/sent-message.event';
import { Logger } from '@nestjs/common';
import { CreateChatroomRepository } from '../ports/create-chatroom.repository';
import { Message } from '../../domain/message';

@EventsHandler(SentMessageEvent)
export class SentMessageEventHandler
  implements IEventHandler<SentMessageEvent>
{
  private readonly logger = new Logger(SentMessageEventHandler.name);

  constructor(
    private readonly createChatroomRepository: CreateChatroomRepository,
  ) {}

  async handle(event: SentMessageEvent): Promise<void> {
    this.logger.log(`Sent message event: ${JSON.stringify(event.message)}`);

    // * 同步資料到 read db

    // * websocket 通知給有在線的人
    const {
      message: { chatroomId, content },
      socket,
    } = event;
    socket.to(`chatroom-${chatroomId}`).emit('message', content);
  }
}
