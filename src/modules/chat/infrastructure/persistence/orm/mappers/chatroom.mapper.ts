import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { ChatroomEntity } from '../entities/chatroom.entity';

export class ChatroomMapper {
  // static toDomain(chatroomEntity: ChatroomEntity): Chatroom {
  //   const { id, name, users, createdAt, updatedAt, deletedAt } = chatroomEntity;
  //   const chatroomModel = new Chatroom();
  //   chatroomModel.id = id;
  //   chatroomModel.name = name;
  //   chatroomModel.users = users;
  //   chatroomModel.createdAt = createdAt;
  //   chatroomModel.updatedAt = updatedAt;
  //   chatroomModel.deletedAt = deletedAt;
  //   return chatroomModel;
  // }

  static toPersistence(chatroom: Chatroom): ChatroomEntity {
    const { id, name, createdAt, updatedAt, deletedAt } = chatroom;
    const chatroomEntity = new ChatroomEntity();
    chatroomEntity.id = id;
    chatroomEntity.name = name;
    chatroomEntity.createdAt = createdAt;
    chatroomEntity.updatedAt = updatedAt;
    chatroomEntity.deletedAt = deletedAt;
    return chatroomEntity;
  }
}
