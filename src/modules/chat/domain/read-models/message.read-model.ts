import { Types } from 'mongoose';

export class MessageReadModel {
  _id: Types.ObjectId;
  id: number;
  chatroomId: number;
  senderId: number;
  image: string;
  content: string;
  createdAt: Date;
}
