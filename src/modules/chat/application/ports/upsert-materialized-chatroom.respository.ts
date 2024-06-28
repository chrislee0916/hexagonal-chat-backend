import { Chatroom } from '../../domain/chatroom';
import { Message } from '../../domain/message';
import { ChatroomReadModel } from '../../domain/read-models/chatroom.read-model';
import { MaterializedChatroomView } from '../../infrastructure/persistence/orm/schemas/materialized-chatroom-view.schema';

export abstract class UpsertMaterializedChatroomRespository {
  abstract upsert(
    chatroom: Pick<ChatroomReadModel, 'id'> & Partial<ChatroomReadModel>,
  ): Promise<void>;
}
