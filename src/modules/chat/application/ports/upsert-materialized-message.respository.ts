import { Chatroom } from '../../domain/chatroom';
import { Message } from '../../domain/message';
import { MessageReadModel } from '../../domain/read-models/message.read-model';
import { MaterializedChatroomView } from '../../infrastructure/persistence/orm/schemas/materialized-chatroom-view.schema';
import { MaterializedMessageView } from '../../infrastructure/persistence/orm/schemas/materialized-message-view.schema';

export abstract class UpsertMaterializedMessageRespository {
  abstract upsert(
    message: Pick<MessageReadModel, 'id'> & Partial<MessageReadModel>,
  ): Promise<void>;
}
