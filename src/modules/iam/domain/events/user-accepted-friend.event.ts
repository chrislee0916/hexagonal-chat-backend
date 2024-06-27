import { User } from '../user';

export class UserAcceptedFriendEvent {
  constructor(
    public readonly user: User,
    public readonly friend: User,
  ) {}
}
