import { Socket } from 'socket.io';
import { Chatroom } from '../../domain/chatroom';
import { Message } from '../../domain/message';

export abstract class CreateChatroomRepository {
  abstract save(chatroom: Chatroom): Promise<Chatroom>;
  abstract saveMessage(chatroom: Chatroom): Promise<Chatroom>;
}
