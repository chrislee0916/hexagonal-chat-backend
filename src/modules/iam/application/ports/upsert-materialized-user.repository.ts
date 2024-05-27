import { UserReadModel } from '../../domain/read-models/user.read-model';

export abstract class UpsertMaterializedUserRepository {
  abstract upsert(
    user: Pick<UserReadModel, 'id'> & Partial<UserReadModel>,
  ): Promise<void>;
}
