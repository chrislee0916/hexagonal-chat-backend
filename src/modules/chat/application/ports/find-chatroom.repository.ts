import { Chatroom } from '../../domain/chatroom';

export abstract class FindChatroomRepository {
  abstract findOne(user1Id: number, user2Id: number): Promise<Chatroom>;
}
