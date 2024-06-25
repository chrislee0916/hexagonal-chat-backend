import { User } from '../../domain/user';

export abstract class CreateUserRepository {
  abstract save(user: User): Promise<User>;
  abstract askFriend(userId: number, friendEmail: string): Promise<User>;
  abstract acceptFriend(userId: number, friendId: number): Promise<void>;
}
