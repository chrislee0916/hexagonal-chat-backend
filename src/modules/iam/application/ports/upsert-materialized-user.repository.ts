import { MaterializedUserView } from '../../infrastructure/persistence/orm/schemas/materialized-user-view.schema';

export abstract class UpsertMaterializedUserRepository {
  abstract upsert(
    user: Pick<MaterializedUserView, 'id'> & Partial<MaterializedUserView>,
  ): Promise<void>;
}
