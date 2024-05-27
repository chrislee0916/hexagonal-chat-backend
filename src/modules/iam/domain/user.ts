import { AggregateRoot } from '@nestjs/cqrs';
import { UserSignedUpEvent } from './events/user-signed-up.event';
import { UserAskedFriendEvent } from './events/user-asked-friend.event';
import { UserAcceptedFriendEvent } from './events/user-accepted-friend.event';

export class User extends AggregateRoot {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;

  constructor() {
    super();
  }

  signedUp() {
    this.apply(new UserSignedUpEvent(this), { skipHandler: true });
  }

  askedFriend(friendId: number) {
    this.apply(new UserAskedFriendEvent(this.id, friendId), {
      skipHandler: true,
    });
  }

  acceptedFriend(friendId: number) {
    this.apply(new UserAcceptedFriendEvent(this.id, friendId), {
      skipHandler: true,
    });
  }
}
