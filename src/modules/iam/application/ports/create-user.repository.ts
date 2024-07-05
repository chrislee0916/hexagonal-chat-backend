import { UserAcceptedFriendEvent } from '../../domain/events/user-accepted-friend.event';
import { UserAskedFriendEvent } from '../../domain/events/user-asked-friend.event';
import { User } from '../../domain/user';

export abstract class CreateUserRepository {
  abstract save(user: User): Promise<User>;
  abstract askFriend(
    userId: number,
    friendEmail: string,
  ): Promise<UserAskedFriendEvent>;
  abstract acceptFriend(
    userId: number,
    friendId: number,
  ): Promise<UserAcceptedFriendEvent>;
}
