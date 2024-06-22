import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAcceptedFriendEvent } from '../../domain/events/user-accepted-friend.event';
import { Logger } from '@nestjs/common';
import { FindUserRepository } from '../ports/find-user.repository';
import { UpsertMaterializedUserRepository } from '../ports/upsert-materialized-user.repository';
import { ObjectId } from 'typeorm';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { Types } from 'mongoose';

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

    // * 更新 read db 中好友的資料
    await this.upsertUserRepository.upsert({
      id: userId,
      askFriends: this.removeAcceptedId(user.askFriends, friendId),
      friends: [friend._id, ...user.friends.flatMap((val) => val._id)],
    });
    await this.upsertUserRepository.upsert({
      id: friendId,
      friends: [user._id, ...friend.friends.flatMap((val) => val._id)],
    });

    // TODO: socket 同步通知對方有新好友加入
  }

  // * 從好友邀請列表移除 已經接受的好友
  private removeAcceptedId(
    askFriends: UserReadModel['askFriends'],
    acceptedId: number,
  ): Types.ObjectId[] {
    let res: Types.ObjectId[] = [];
    askFriends.forEach((friend) => {
      if (friend.id !== acceptedId) {
        res.push(friend._id);
      }
    });
    return res;
  }
}
