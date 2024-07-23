import { Types } from 'mongoose';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';

export class UserReadModel {
  // _id: Types.ObjectId;
  id: number;
  name: string;
  email: string;
  password: string;
  image: string;
  friends?: Pick<
    UserReadModel,
    'id' | 'name' | 'email' | 'image' | 'updatedAt'
  >[];
  askFriends?: Pick<
    UserReadModel,
    'id' | 'name' | 'email' | 'image' | 'updatedAt'
  >[];
  chatrooms?: Pick<
    ChatroomReadModel,
    'id' | 'name' | 'image' | 'newMessage' | 'lastAckId'
  >[];
  // chatrooms?: number[];
  createdAt: Date;
  updatedAt: Date;
}
