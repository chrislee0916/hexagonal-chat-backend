import { Chatroom } from '../../domain/chatroom';
import { Message } from '../../domain/message';
import { MaterializedChatroomView } from '../../infrastructure/persistence/orm/schemas/materialized-chatroom-view.schema';

export abstract class UpsertMaterializedChatroomRespository {
  abstract upsert(
    chatroom: Pick<Chatroom, 'id'> & Partial<Chatroom>,
  ): Promise<void>;
}
