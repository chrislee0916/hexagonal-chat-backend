import { FindMessageRepository } from 'src/modules/chat/application/ports/find-message.repository';
import { MessageReadModel } from 'src/modules/chat/domain/read-models/message.read-model';
import { MaterializedMessageView } from '../schemas/materialized-message-view.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class OrmFindMessageRepository implements FindMessageRepository {
  constructor(
    @InjectModel(MaterializedMessageView.name)
    private readonly messageModel: Model<MaterializedMessageView>,
  ) {}

  async findList(): Promise<MessageReadModel[]> {
    const res = await this.messageModel.find().exec();
    return res;
  }
}
