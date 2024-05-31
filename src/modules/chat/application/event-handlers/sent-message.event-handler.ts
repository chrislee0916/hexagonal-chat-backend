import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SentMessageEvent } from '../../domain/events/sent-message.event';
import { Logger } from '@nestjs/common';

@EventsHandler(SentMessageEvent)
export class SentMessageEventHandler
  implements IEventHandler<SentMessageEvent>
{
  private readonly logger = new Logger(SentMessageEventHandler.name);

  handle(event: SentMessageEvent) {
    this.logger.log(`Sent message event: ${JSON.stringify(event)}`);
  }
}
