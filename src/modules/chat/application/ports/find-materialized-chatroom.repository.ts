import { ChatroomReadModel } from '../../domain/read-models/chatroom.read-model';

export abstract class FindMaterializedChatroomRepository {
  abstract findOne(id: number): Promise<ChatroomReadModel>;
}
