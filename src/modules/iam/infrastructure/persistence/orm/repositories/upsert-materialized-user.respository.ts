import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpsertMaterializedUserRepository } from 'src/modules/iam/application/ports/upsert-materialized-user.repository';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { MaterializedUserView } from '../schemas/materialized-user-view.schema';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFriendEntity } from '../entities/user-friend.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrmUpsertMaterializedUserRepository
  implements UpsertMaterializedUserRepository
{
  constructor(
    @InjectModel(MaterializedUserView.name)
    private readonly userModel: Model<MaterializedUserView>,
  ) {}

  async upsert(
    user: Pick<UserReadModel, 'id'> & Partial<UserReadModel>,
  ): Promise<void> {
    await this.userModel.findOneAndUpdate({ id: user.id }, user, {
      upsert: true,
    });
  }

  async upsertMany(
    users: (Pick<UserReadModel, 'id'> & Partial<UserReadModel>)[],
  ): Promise<void> {
    const operations = users.map((user) => ({
      updateOne: {
        filter: { id: user.id },
        update: user,
        upsert: true,
      },
    }));
    await this.userModel.bulkWrite(operations);
  }
}
