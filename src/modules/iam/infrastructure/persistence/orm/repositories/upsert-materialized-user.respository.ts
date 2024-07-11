import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpsertMaterializedUserRepository } from 'src/modules/iam/application/ports/upsert-materialized-user.repository';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { MaterializedUserView } from '../schemas/materialized-user-view.schema';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFriendEntity } from '../entities/user-friend.entity';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class OrmUpsertMaterializedUserRepository
  implements UpsertMaterializedUserRepository
{
  constructor(
    @InjectModel(MaterializedUserView.name)
    private readonly userModel: Model<MaterializedUserView>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async upsert(
    user: Pick<UserReadModel, 'id'> & Partial<UserReadModel>,
  ): Promise<void> {
    await this.userModel.findOneAndUpdate({ id: user.id }, user, {
      upsert: true,
    });
  }

  async upsertChatrooms(userIds: number[]): Promise<void> {
    let users = await this.userRepository.find({
      where: {
        id: In(userIds),
      },
      relations: {
        chatrooms: true,
      },
    });
    console.log(
      'user chatroomsIds: ',
      users[0].chatrooms.flatMap((chatroom) => chatroom.id),
    );
    const operations = users.map((user) => ({
      updateOne: {
        filter: { id: user.id },
        update: {
          ...user,
          chatrooms: user.chatrooms.flatMap((chatroom) => chatroom.id),
        },
        upsert: true,
      },
    }));
    await this.userModel.bulkWrite(operations);
  }
}
