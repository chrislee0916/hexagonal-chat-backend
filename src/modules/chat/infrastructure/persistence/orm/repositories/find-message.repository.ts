import { FindMessageRepository } from 'src/modules/chat/application/ports/find-message.repository';
import { MessageReadModel } from 'src/modules/chat/domain/read-models/message.read-model';
import { MaterializedMessageView } from '../schemas/materialized-message-view.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindListMessageQuery } from 'src/modules/chat/application/querys/impl/find-list-message.query';

export class OrmFindMessageRepository implements FindMessageRepository {
  constructor(
    @InjectModel(MaterializedMessageView.name)
    private readonly messageModel: Model<MaterializedMessageView>,
  ) {}
  async findList(query: FindListMessageQuery): Promise<MessageReadModel[]> {
    const res = await this.messageModel
      .find()
      .where({ chatroomId: query.id })
      .limit(query.limit)
      .skip(query.skip)
      .sort(query.sort);
    return res;
  }
}
