import { Types } from 'mongoose';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { MessageReadModel } from './message.read-model';

export class ChatroomReadModel {
  _id: Types.ObjectId;
  id: number;
  name: string;
  image: string;
  users: Pick<UserReadModel, 'id' | 'name' | 'email' | 'image'>[];
  newMessage: Omit<MessageReadModel, '_id'>;
  createdAt: Date;
  updatedAt: Date;
}
