import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpsertMaterializedChatroomRespository } from 'src/modules/chat/application/ports/upsert-materialized-chatroom.respository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { MaterializedUserView } from 'src/modules/iam/infrastructure/persistence/orm/schemas/materialized-user-view.schema';
import { MaterializedChatroomView } from '../schemas/materialized-chatroom-view.schema';
import { Message } from 'src/modules/chat/domain/message';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';
import { ChatroomUser } from '../schemas/chatroom-user.schema';

@Injectable()
export class OrmUpsertMaterializedChatroomRepository
  implements UpsertMaterializedChatroomRespository
{
  constructor(
    @InjectModel(ChatroomUser.name)
    private readonly chatroomUserModel: Model<ChatroomUser>,
    @InjectModel(MaterializedChatroomView.name)
    private readonly chatroomModel: Model<MaterializedChatroomView>,
  ) {}

  async upsert(
    chatroom: Pick<Chatroom, 'id'> & Partial<Chatroom>,
  ): Promise<void> {
    await this.chatroomModel.findOneAndUpdate(
      { id: chatroom.id },
      {
        name: chatroom.name,
        image: chatroom.image,
        newMessage: chatroom.newMessage,
      },
      {
        upsert: true,
      },
    );

    if (chatroom.users?.length) {
      await this.chatroomUserModel.bulkWrite(
        chatroom.users.map((user) => ({
          updateOne: {
            filter: { chatroomId: chatroom.id, userId: user.userId },
            update: {
              chatroomId: chatroom.id,
              userId: user.userId,
              lastAckId: user.lastAckId,
              joinedAt: user.joinedAt,
              leftAt: user.leftAt,
            },
            upsert: true,
          },
        })),
      );
    }
  }
}
