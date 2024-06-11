import { Message } from 'src/modules/chat/domain/message';
import { MessageEntity } from '../entities/message.entity';

export class MessageMapper {
  static toDomain(message: MessageEntity): Message {
    const { id, chatroomId, senderId, content, createdAt } = message;
    const messageModel = new Message(chatroomId, senderId, content);
    message.id = id;
    message.createdAt = createdAt;
    return messageModel;
  }

  static toPersistence(message: Message): MessageEntity {
    const { id, chatroomId, senderId, content, createdAt } = message;
    const messageEntity = new MessageEntity();
    messageEntity.id = id;
    messageEntity.chatroomId = chatroomId;
    messageEntity.senderId = senderId;
    messageEntity.content = content;
    messageEntity.createdAt = createdAt;
    return messageEntity;
  }
}
