import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAskedFriendEvent } from '../../domain/events/user-asked-friend.event';
import { Logger } from '@nestjs/common';
import { UpsertMaterializedUserRepository } from '../ports/upsert-materialized-user.repository';
import { FindUserRepository } from '../ports/find-user.repository';

@EventsHandler(UserAskedFriendEvent)
export class UserAskedFriendEventHandler
  implements IEventHandler<UserAskedFriendEvent>
{
  private readonly logger = new Logger(UserAskedFriendEventHandler.name);

  constructor(
    private readonly findUserRepository: FindUserRepository,
    // private readonly create
    private readonly upsertMaterializedUserRepository: UpsertMaterializedUserRepository,
  ) {}

  async handle(event: UserAskedFriendEvent) {
    this.logger.log(`User asked friend event: ${JSON.stringify(event)}`);

    const { user, friend } = event;
    // * 同步資料到 read db
    // TODO: 後續改用 CDC
    await Promise.all([
      this.upsertMaterializedUserRepository.syncFriendShip(user.id),
      this.upsertMaterializedUserRepository.syncFriendShip(friend.id),
    ]);

    // TODO: 對方在線用 socket.io 通知有好友邀請，不在線則用離線訊息
  }
}
