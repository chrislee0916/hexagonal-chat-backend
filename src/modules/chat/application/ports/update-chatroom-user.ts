import { ChatroomUser } from '../../domain/chatroom-user';

export abstract class UpdateChatroomUserRepository {
  abstract update(
    chatroomUser: Pick<ChatroomUser, 'userId' | 'chatroomId'> &
      Partial<ChatroomUser>,
  ): Promise<void>;
}
