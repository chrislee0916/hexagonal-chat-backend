import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpsertMaterializedChatroomRespository } from 'src/modules/chat/application/ports/upsert-materialized-chatroom.respository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { MaterializedUserView } from 'src/modules/iam/infrastructure/persistence/orm/schemas/materialized-user-view.schema';
import { MaterializedChatroomView } from '../schemas/materialized-chatroom-view.schema';
import { Message } from 'src/modules/chat/domain/message';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';

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
    chatroom: Pick<ChatroomReadModel, 'id'> & Partial<ChatroomReadModel>,
  ): Promise<void> {
    console.log('chatroom: ', chatroom);
    await this.chatroomModel.findOneAndUpdate(
      { id: chatroom.id },
      {
        name: chatroom.name,
        users: chatroom.users,
        newMessage: chatroom.newMessage,
      },
      {
        upsert: true,
      },
    );
  }
}
