import { Chatroom } from '../../domain/chatroom';

export abstract class CreateChatroomRepository {
  abstract save(chatroom: Chatroom, userIds: number[]): Promise<Chatroom>;
}
