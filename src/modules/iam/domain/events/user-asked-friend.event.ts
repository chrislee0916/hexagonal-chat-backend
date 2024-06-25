import { UserReadModel } from '../read-models/user.read-model';
import { User } from '../user';

export class UserAskedFriendEvent {
  constructor(public readonly user: User) {}
}
