import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { WebSocketService } from '../ports/websocket.service';
import { MessageSeenEvent } from '../../domain/events/message-seen.event';

@EventsHandler(MessageSeenEvent)
export class MessageSeenEventHandler
  implements IEventHandler<MessageSeenEvent>
{
  private readonly logger = new Logger(MessageSeenEventHandler.name);

  constructor(private readonly webSocketService: WebSocketService) {}

  async handle(event: MessageSeenEvent): Promise<void> {
    this.logger.log(`Message seen event: ${JSON.stringify(event)}`);

    // * websocket 通知給有在線的人
    this.webSocketService.brocastToChatroom(
      'messageSeen',
      event.chatroomId,
      event,
    );
  }
}
