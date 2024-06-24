import { Types } from 'mongoose';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';

export class UserReadModel {
  _id: Types.ObjectId;
  id: number;
  name: string;
  email: string;
  password: string;
  image: string;
  friends?: Pick<UserReadModel, '_id' | 'id' | 'name' | 'email' | 'image'>[];
  askFriends?: Pick<UserReadModel, '_id' | 'id' | 'name' | 'email' | 'image'>[];
  chatrooms?: Pick<ChatroomReadModel, '_id' | 'id' | 'name' | 'image'>[];
  // friends?: number[];
  // askFriends?: number[];
  createdAt: Date;
  updatedAt: Date;
}
