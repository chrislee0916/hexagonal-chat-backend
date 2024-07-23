import { Message } from 'src/modules/chat/domain/message';
import { MessageEntity } from '../entities/message.entity';

export class MessageMapper {
  static toDomain(message: MessageEntity): Message {
    const { id, chatroomId, senderId, image, content, createdAt } = message;
    const messageModel = new Message(chatroomId, senderId, image, content);
    messageModel.id = id;
    messageModel.createdAt = createdAt;
    return messageModel;
  }

  static toPersistence(message: Message): MessageEntity {
    const { id, chatroomId, senderId, image, content, createdAt } = message;
    const messageEntity = new MessageEntity();
    messageEntity.id = id;
    messageEntity.chatroomId = chatroomId;
    messageEntity.senderId = senderId;
    messageEntity.image = image;
    messageEntity.content = content;
    messageEntity.createdAt = createdAt;
    return messageEntity;
  }
}
