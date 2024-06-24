import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpsertMaterializedChatroomRespository } from 'src/modules/chat/application/ports/upsert-materialized-chatroom.respository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { MaterializedUserView } from 'src/modules/iam/infrastructure/persistence/orm/schemas/materialized-user-view.schema';
import { MaterializedChatroomView } from '../schemas/materialized-chatroom-view.schema';
import { Message } from 'src/modules/chat/domain/message';

@Injectable()
export class OrmUpsertMaterializedChatroomRepository
  implements UpsertMaterializedChatroomRespository
{
  constructor(
    @InjectModel(MaterializedUserView.name)
    private readonly userModel: Model<MaterializedUserView>,
    @InjectModel(MaterializedChatroomView.name)
    private readonly chatroomModel: Model<MaterializedChatroomView>,
  ) {}

  async upsert(
    chatroom: Pick<Chatroom, 'id'> & Partial<Chatroom>,
  ): Promise<void> {
    const chatroomReadModel = await this.chatroomModel.findOneAndUpdate(
      { id: chatroom.id },
      {
        name: chatroom.name,
      },
      {
        upsert: true,
        new: true,
      },
    );
    const userObjectIds = [];
    await Promise.all(
      chatroom.users.map(async (user) => {
        const res = await this.userModel.findOne({ id: user.userId });
        userObjectIds.push(res._id);
        return this.userModel.findOneAndUpdate(
          { id: res.id },
          {
            chatrooms: [chatroomReadModel._id, ...res.chatrooms],
          },
        );
      }),
    );
    await this.chatroomModel.findOneAndUpdate(
      { id: chatroom.id },
      {
        users: userObjectIds,
      },
    );
  }

  async saveMessage(
    message: Pick<Message, 'id'> & Partial<Message>,
  ): Promise<void> {}
}
