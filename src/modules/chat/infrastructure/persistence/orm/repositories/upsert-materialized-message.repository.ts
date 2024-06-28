import { InjectModel } from '@nestjs/mongoose';
import { UpsertMaterializedMessageRespository } from 'src/modules/chat/application/ports/upsert-materialized-message.respository';
import { MessageReadModel } from 'src/modules/chat/domain/read-models/message.read-model';
import { MaterializedMessageView } from '../schemas/materialized-message-view.schema';
import { Model } from 'mongoose';

export class OrmUpsertMaterializedMessageRepository
  implements UpsertMaterializedMessageRespository
{
  constructor(
    @InjectModel(MaterializedMessageView.name)
    private readonly messageModel: Model<MaterializedMessageView>,
  ) {}

  async upsert(
    message: Pick<MessageReadModel, 'id'> & Partial<MessageReadModel>,
  ): Promise<void> {
    await this.messageModel.findOneAndUpdate({ id: message.id }, message, {
      upsert: true,
    });
  }
}
