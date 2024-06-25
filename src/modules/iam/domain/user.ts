import { AggregateRoot } from '@nestjs/cqrs';
import { UserSignedUpEvent } from './events/user-signed-up.event';
import { UserAskedFriendEvent } from './events/user-asked-friend.event';
import { UserAcceptedFriendEvent } from './events/user-accepted-friend.event';
import { UserReadModel } from './read-models/user.read-model';
import { Types } from 'mongoose';
import { Chatroom } from './chatroom';

export class User extends AggregateRoot {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public image: string;
  public askFriends = new Array<
    Pick<User, 'id' | 'name' | 'email' | 'image'>
  >();
  public friends = new Array<Pick<User, 'id' | 'name' | 'email' | 'image'>>();
  public chatrooms = new Array<Chatroom>();
  public createdAt: Date;
  public updatedAt: Date;

  constructor() {
    super();
  }

  signedUp() {
    this.apply(new UserSignedUpEvent(this), { skipHandler: true });
  }

  askedFriend() {
    this.apply(new UserAskedFriendEvent(this), {
      skipHandler: true,
    });
  }

  acceptedFriend(friendId: number) {
    this.apply(new UserAcceptedFriendEvent(this.id, friendId), {
      skipHandler: true,
    });
  }
}
