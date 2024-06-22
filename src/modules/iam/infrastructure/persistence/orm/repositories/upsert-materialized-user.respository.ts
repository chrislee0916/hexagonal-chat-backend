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
    @InjectRepository(UserFriendEntity)
    private readonly userFriendRepository: Repository<UserFriendEntity>,
  ) {}

  async upsert(
    user: Pick<MaterializedUserView, 'id'> & Partial<MaterializedUserView>,
  ): Promise<void> {
    await this.userModel.findOneAndUpdate({ id: user.id }, user, {
      upsert: true,
    });
  }

  async syncFriendShip(userId: number): Promise<void> {
    const friendShips = await this.userFriendRepository.findBy({
      userId,
      deletedAt: null,
    });

    let askFriendIds = friendShips
      .filter((val) => val.status === 'pending')
      .flatMap((val) => val.friendId);

    let askFriends = await this.userModel.find({ id: { $in: askFriendIds } });

    let friendIds = friendShips
      .filter((val) => val.status === 'accepted')
      .flatMap((val) => val.friendId);

    let friends = await this.userModel.find({ id: { $in: friendIds } });

    await this.userModel.findOneAndUpdate(
      { id: userId },
      {
        askFriends: askFriends.flatMap((val) => val._id),
        friends: friends.flatMap((val) => val._id),
      },
    );
  }
}
