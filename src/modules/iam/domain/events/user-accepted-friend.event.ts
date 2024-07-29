import { UserReadModel } from '../read-models/user.read-model';
import { User } from '../user';

export class UserAcceptedFriendSocketEvent {
  event: 'newFriend';
  userId: number;
  data: Pick<User, 'id' | 'name' | 'email' | 'image' | 'updatedAt'>;
}

export class UserAcceptedFriendEvent {
  constructor(
    public readonly shouldUpdates: (Pick<UserReadModel, 'id'> &
      Partial<UserReadModel>)[],
    public readonly socketEvents: UserAcceptedFriendSocketEvent[],
  ) {}
}
