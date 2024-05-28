import { Chatroom } from '../../domain/chatroom';

export abstract class CreateChatroomRepository {
  abstract save(chatroom: Chatroom): Promise<Chatroom>;
  abstract addUsers(chatroomId: number, userIds: number[]): Promise<void>;
}
