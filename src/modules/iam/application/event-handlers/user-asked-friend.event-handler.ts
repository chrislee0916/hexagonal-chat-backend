import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAskedFriendEvent } from '../../domain/events/user-asked-friend.event';
import { Logger } from '@nestjs/common';
import { UpsertMaterializedUserRepository } from '../ports/upsert-materialized-user.repository';
import { FindUserRepository } from '../ports/find-user.repository';
import { WebSocketService } from 'src/modules/chat/application/ports/websocket.service';
import { User } from '../../domain/user';

@EventsHandler(UserAskedFriendEvent)
export class UserAskedFriendEventHandler
  implements IEventHandler<UserAskedFriendEvent>
{
  private readonly logger = new Logger(UserAskedFriendEventHandler.name);

  constructor(
    private readonly upsertMaterializedUserRepository: UpsertMaterializedUserRepository,
    private readonly webSocketService: WebSocketService,
  ) {}

  async handle(event: UserAskedFriendEvent) {
    this.logger.log(`User asked friend event: ${JSON.stringify(event)}`);

    const { shouldUpdate, socketEvent } = event;
    // TODO: 後續改用 CDC
    // * 同步資料到 read db
    this.upsertMaterializedUserRepository.upsert({
      id: shouldUpdate.id,
      askFriends: shouldUpdate.askFriends,
      friends: shouldUpdate.friends,
    });

    // TODO: 對方在線用 socket.io 通知有好友邀請，不在線則用離線訊息
    this.webSocketService.sendToPerson(
      socketEvent.event,
      socketEvent.userId,
      socketEvent.data,
    );
  }
}
