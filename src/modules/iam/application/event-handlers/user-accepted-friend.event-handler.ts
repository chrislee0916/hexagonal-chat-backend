import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAcceptedFriendEvent } from '../../domain/events/user-accepted-friend.event';
import { Logger } from '@nestjs/common';
import { FindUserRepository } from '../ports/find-user.repository';
import { UpsertMaterializedUserRepository } from '../ports/upsert-materialized-user.repository';
import { ObjectId } from 'typeorm';
import { UserReadModel } from '../../domain/read-models/user.read-model';

// TODO: 之後想改成 postgres change data capture (CDC)
@EventsHandler(UserAcceptedFriendEvent)
export class UserAcceptedFriendEventHandler
  implements IEventHandler<UserAcceptedFriendEvent>
{
  private readonly logger = new Logger(UserAcceptedFriendEventHandler.name);

  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly upsertUserRepository: UpsertMaterializedUserRepository,
  ) {}
  async handle(event: UserAcceptedFriendEvent) {
    this.logger.log(`User accepted friend event: ${JSON.stringify(event)}`);

    const { userId, friendId } = event;

    let user = await this.findUserRepository.findOneById(userId);
    let friend = await this.findUserRepository.findOneById(friendId);

    // user.friends.unshift(friend.id);
    // friend.friends.unshift(user.id);

    await this.upsertUserRepository.upsert({
      id: userId,
      askFriends: this.filterAskFriends(user.askFriends),
      friends: [friendId, ...user.friends.flatMap((val) => val.id)],
    });
    await this.upsertUserRepository.upsert({
      id: friendId,
      friends: [userId, ...friend.friends.flatMap((val) => val.id)],
    });

    // TODO: socket 同步通知對方有新好友加入
  }

  private filterAskFriends(
    friends: Pick<UserReadModel, 'id' | 'name' | 'email' | 'image'>[],
    acceptedId: number,
  ): number[] {
    const idx = friends.findIndex((val) => val.id === acceptedId);
    return [...friends.slice(0, idx), ...friends.slice(idx + 1)];
  }
}
