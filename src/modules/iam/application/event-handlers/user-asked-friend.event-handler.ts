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

    // * 同步資料到 read db
    const { userId, friendId } = event;
    const user = await this.findUserRepository.findOneById(userId);
    const friend = await this.findUserRepository.findOneById(friendId);

    const askFriends = friend.askFriends.flatMap((ask) => ask.id);
    await this.upsertMaterializedUserRepository.upsert({
      id: friendId,
      askFriends: [userId, ...askFriends],
    });

    // TODO: 對方在線用 socket.io 通知有好友邀請，不在線則用離線訊息
  }
}
