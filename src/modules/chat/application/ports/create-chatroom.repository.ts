import { Chatroom } from '../../domain/chatroom';
import { ChatroomReadModel } from '../../domain/read-models/chatroom.read-model';

export abstract class CreateChatroomRepository {
  abstract save(chatroom: Chatroom): Promise<Chatroom>;
}
