import { Types } from 'mongoose';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { MessageReadModel } from './message.read-model';

export class ChatroomReadModel {
  _id: Types.ObjectId;
  id: number;
  name: string;
  image: string;
  users: {
    id: number;
    email: string;
    name: string;
    image: string;
    joinedAt: Date;
    lastAckId: number;
  }[];
  newMessage: Omit<MessageReadModel, '_id'>;
  lastAckId?: number;
  createdAt: Date;
  updatedAt: Date;
}
