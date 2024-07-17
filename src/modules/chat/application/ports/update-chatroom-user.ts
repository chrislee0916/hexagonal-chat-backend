import { ChatroomUser } from '../../domain/chatroom-user';

export abstract class UpdateChatroomUserRepository {
  abstract update(chatroomUser: ChatroomUser[]): Promise<void>;
}
