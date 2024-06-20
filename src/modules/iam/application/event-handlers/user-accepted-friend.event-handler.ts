import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAcceptedFriendEvent } from '../../domain/events/user-accepted-friend.event';
import { Logger } from '@nestjs/common';
import { FindUserRepository } from '../ports/find-user.repository';
import { UpsertMaterializedUserRepository } from '../ports/upsert-materialized-user.repository';
import { ObjectId } from 'typeorm';

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

    const now = new Date();
    user.friends.unshift({
      id: friend.id,
      name: friend.name,
      email: friend.email,
      image: friend.image,
      createdAt: now,
      updatedAt: now,
    });
    friend.friends.unshift({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: now,
      updatedAt: now,
    });

    await this.upsertUserRepository.upsert(user);
    await this.upsertUserRepository.upsert(friend);
  }
}
