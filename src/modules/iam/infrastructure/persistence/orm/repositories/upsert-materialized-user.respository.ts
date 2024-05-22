import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpsertMaterializedUserRepository } from 'src/modules/iam/application/ports/upsert-materialized-user.repository';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { MaterializedUserView } from '../schemas/materialized-user-view.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrmUpsertMaterializedUserRepository
  implements UpsertMaterializedUserRepository
{
  constructor(
    @InjectModel(MaterializedUserView.name)
    private readonly userModel: Model<MaterializedUserView>,
  ) {}

  async upsert(user: UserReadModel): Promise<void> {
    console.log('user: ', user);
    await this.userModel.findOneAndUpdate({ id: user.id }, user, {
      upsert: true,
    });
  }
}
