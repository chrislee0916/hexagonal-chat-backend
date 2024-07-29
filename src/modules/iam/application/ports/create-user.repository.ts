import { UserAcceptedFriendEvent } from '../../domain/events/user-accepted-friend.event';
import { UserAskedFriendEvent } from '../../domain/events/user-asked-friend.event';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { User } from '../../domain/user';

export abstract class CreateUserRepository {
  abstract save(user: User): Promise<User>;
  abstract askFriend(
    userModel: UserReadModel,
    friendModel: UserReadModel,
  ): Promise<UserAskedFriendEvent | UserAcceptedFriendEvent>;
  abstract acceptFriend(
    userModel: UserReadModel,
    friendModel: UserReadModel,
  ): Promise<UserAcceptedFriendEvent>;
}
