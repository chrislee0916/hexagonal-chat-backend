import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAskedFriendEvent } from '../../domain/events/user-asked-friend.event';
import { Logger } from '@nestjs/common';

@EventsHandler(UserAskedFriendEvent)
export class UserAskedFriendEventHandler
  implements IEventHandler<UserAskedFriendEvent>
{
  private readonly logger = new Logger(UserAskedFriendEventHandler.name);

  handle(event: UserAskedFriendEvent) {
    this.logger.log(`User asked friend event: ${JSON.stringify(event)}`);
  }
}
