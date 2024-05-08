import { User } from '../../domain/user';

export abstract class CreateUserRepository {
  abstract save(user: User): Promise<User>;
}
