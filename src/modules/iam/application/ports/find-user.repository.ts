import { UserReadModel } from '../../domain/read-models/user.read-model';

export abstract class FindUserRepository {
  abstract findOneByEmail(email: string): Promise<UserReadModel>;
  abstract findOneById(id: number): Promise<UserReadModel>;
  abstract findOneByObjectId(id: string): Promise<UserReadModel>;
}
