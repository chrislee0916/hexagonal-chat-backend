import { User } from '../user';

export class UserAcceptedFriendSocketEvent {
  event: 'newFriend';
  userId: number;
  data: Pick<User, 'id' | 'name' | 'email' | 'image' | 'updatedAt'>;
}

export class UserAcceptedFriendEvent {
  constructor(
    public readonly shouldUpdate: User[],
    public readonly socketEvents: UserAcceptedFriendSocketEvent[],
  ) {}
}
