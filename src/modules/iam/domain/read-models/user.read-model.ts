import { Types } from 'mongoose';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';

export class UserReadModel {
  _id: Types.ObjectId;
  id: number;
  name: string;
  email: string;
  password: string;
  image: string;
  friends?: Pick<UserReadModel, 'id' | 'name' | 'email' | 'image'>[];
  askFriends?: Pick<UserReadModel, 'id' | 'name' | 'email' | 'image'>[];
  chatrooms?: Pick<ChatroomReadModel, 'id' | 'name' | 'image'>[];
  createdAt: Date;
  updatedAt: Date;
}
