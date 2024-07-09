import { InjectModel } from '@nestjs/mongoose';
import { FindMaterializedChatroomRepository } from 'src/modules/chat/application/ports/find-materialized-chatroom.repository';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';
import { MaterializedChatroomView } from '../schemas/materialized-chatroom-view.schema';
import { Model } from 'mongoose';

export class OrmFindChatroomRepository
  implements FindMaterializedChatroomRepository
{
  constructor(
    @InjectModel(MaterializedChatroomView.name)
    private readonly chatroomModel: Model<MaterializedChatroomView>,
  ) {}

  async findOne(id: number): Promise<ChatroomReadModel> {
    const res = this.chatroomModel.findOne({ id }).exec();
    return res;
  }
}
