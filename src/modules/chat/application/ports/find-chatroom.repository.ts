import { ChatroomReadModel } from '../../domain/read-models/chatroom.read-model';

export abstract class FindChatroomRepository {
  abstract findOne(id: number): Promise<ChatroomReadModel>;
}
