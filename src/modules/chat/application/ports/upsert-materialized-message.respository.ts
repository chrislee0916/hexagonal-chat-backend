import { Chatroom } from '../../domain/chatroom';
import { Message } from '../../domain/message';
import { MaterializedChatroomView } from '../../infrastructure/persistence/orm/schemas/materialized-chatroom-view.schema';
import { MaterializedMessageView } from '../../infrastructure/persistence/orm/schemas/materialized-message-view.schema';

export abstract class UpsertMaterializedChatroomRespository {
  abstract upsert(
    chatroom: Pick<MaterializedMessageView, 'id'> &
      Partial<MaterializedMessageView>,
  ): Promise<void>;
}
