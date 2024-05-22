import { UserReadModel } from '../../domain/read-models/user.read-model';
import { User } from '../../domain/user';

export abstract class FindUserRepository {
  abstract findOneByEmail(email: string): Promise<UserReadModel>;
  abstract findOneById(id: number): Promise<UserReadModel>;
}
