import { Chatroom } from '../../domain/chatroom';
import { Message } from '../../domain/message';

export abstract class CreateMessageRepository {
  abstract save(chatroom: Chatroom): Promise<Chatroom>;
}
