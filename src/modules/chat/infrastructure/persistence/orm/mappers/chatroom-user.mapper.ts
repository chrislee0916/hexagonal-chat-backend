import { ChatroomUser } from 'src/modules/chat/domain/chatroom-user';
import { ChatroomUserEntity } from '../entities/chatroom_user.entity';

export class ChatroomUserMapper {
  static toDomain(chatroomUserEntity: ChatroomUserEntity): ChatroomUser {
    const { chatroomId, userId, lastAckId, joinedAt, leftAt } =
      chatroomUserEntity;
    const chatroomUserModel = new ChatroomUser(userId);
    chatroomUserModel.chatroomId = chatroomId;
    chatroomUserModel.lastAckId = lastAckId;
    chatroomUserModel.joinedAt = joinedAt;
    chatroomUserModel.leftAt = leftAt;
    return chatroomUserModel;
  }

  static toPersistence(chatroomUser: ChatroomUser): ChatroomUserEntity {
    const { chatroomId, userId, joinedAt, leftAt, lastAckId } = chatroomUser;
    const chatroomUserEntity = new ChatroomUserEntity();
    chatroomUserEntity.chatroomId = chatroomId;
    chatroomUserEntity.userId = userId;
    chatroomUserEntity.joinedAt = joinedAt;
    chatroomUserEntity.leftAt = leftAt;
    chatroomUserEntity.lastAckId = lastAckId;
    return chatroomUserEntity;
  }
}
