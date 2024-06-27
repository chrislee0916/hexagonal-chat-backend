import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAcceptedFriendEvent } from '../../domain/events/user-accepted-friend.event';
import { Logger } from '@nestjs/common';
import { FindUserRepository } from '../ports/find-user.repository';
import { UpsertMaterializedUserRepository } from '../ports/upsert-materialized-user.repository';
import { ObjectId } from 'typeorm';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { Types } from 'mongoose';

@EventsHandler(UserAcceptedFriendEvent)
export class UserAcceptedFriendEventHandler
  implements IEventHandler<UserAcceptedFriendEvent>
{
  private readonly logger = new Logger(UserAcceptedFriendEventHandler.name);

  constructor(
    private readonly upsertMaterializedUserRepository: UpsertMaterializedUserRepository,
  ) {}
  async handle(event: UserAcceptedFriendEvent) {
    this.logger.log(`User accepted friend event: ${JSON.stringify(event)}`);

    const { user, friend } = event;

    // * 同步資料到 read db
    // TODO: 後續改用 CDC
    // * 如果成為好友則兩個都需更新
    await this.upsertMaterializedUserRepository.upsert({
      id: user.id,
      askFriends: user.askFriends,
      friends: user.friends,
    });
    await this.upsertMaterializedUserRepository.upsert({
      id: friend.id,
      askFriends: friend.askFriends,
      friends: friend.friends,
    });
    // TODO: socket 同步通知對方有新好友加入
  }
}
