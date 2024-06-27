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

    private readonly upsertMaterializedUserRepository: UpsertMaterializedUserRepository,
  ) {}

  async handle(event: UserAskedFriendEvent) {
    this.logger.log(`User asked friend event: ${JSON.stringify(event)}`);

    const { user, friend } = event;
    // TODO: 後續改用 CDC
    // * 同步資料到 read db
    // * 如果只有發送好友邀請則更新被邀請的部分
    await this.upsertMaterializedUserRepository.upsert({
      id: user.id,
      askFriends: user.askFriends,
      friends: user.friends,
    });
    // * 如果成為好友則兩個都需更新
    if (friend) {
      await this.upsertMaterializedUserRepository.upsert({
        id: friend.id,
        askFriends: friend.askFriends,
        friends: friend.friends,
      });
    }
    // await Promise.all([
    //   this.upsertMaterializedUserRepository.syncFriendShip(user.id),
    //   this.upsertMaterializedUserRepository.syncFriendShip(friend.id),
    // ]);

    // TODO: 對方在線用 socket.io 通知有好友邀請，不在線則用離線訊息
  }
}
