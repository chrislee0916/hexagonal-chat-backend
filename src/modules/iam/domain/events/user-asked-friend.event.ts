import { UserReadModel } from '../read-models/user.read-model';
import { User } from '../user';

export class UserAskedFriendSocketEvent {
  event: 'newAskFriend' | 'newFriend';
  userId: number;
  data: Pick<User, 'id' | 'name' | 'email' | 'image'>;
}

export class UserAskedFriendEvent {
  constructor(
    public readonly shouldUpdate: Pick<UserReadModel, 'id'> &
      Partial<UserReadModel>,
    public readonly socketEvent: UserAskedFriendSocketEvent,
  ) {}
}
