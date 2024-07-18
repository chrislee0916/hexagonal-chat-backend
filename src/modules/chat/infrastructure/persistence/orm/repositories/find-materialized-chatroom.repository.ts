import { InjectModel } from '@nestjs/mongoose';
import { FindMaterializedChatroomRepository } from 'src/modules/chat/application/ports/find-materialized-chatroom.repository';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';
import {
  MaterializedChatroomView,
  MaterializedChatroomViewDocument,
} from '../schemas/materialized-chatroom-view.schema';
import { Model } from 'mongoose';
import {
  ChatroomUser,
  ChatroomUserDocument,
} from '../schemas/chatroom-user.schema';

export class OrmFindChatroomRepository
  implements FindMaterializedChatroomRepository
{
  constructor(
    @InjectModel(MaterializedChatroomView.name)
    private readonly chatroomModel: Model<MaterializedChatroomViewDocument>,
    @InjectModel(ChatroomUser.name)
    private readonly chatroomUserModel: Model<ChatroomUserDocument>,
  ) {}

  async findOne(id: number): Promise<ChatroomReadModel> {
    const chatroom = await this.chatroomModel.findOne({ id }).exec();

    const chatroomUsers = await this.chatroomUserModel
      .find({ chatroomId: id })
      .populate('user')
      .exec();
    // console.log('chatroomUsers: ', chatroomUsers);
    return {
      ...chatroom.toJSON(),
      users: chatroomUsers.map(({ user, joinedAt, lastAckId }) => ({
        id: user.id,
        image: user.image,
        email: user.email,
        name: user.name,
        joinedAt,
        lastAckId,
      })),
    };
  }
}
