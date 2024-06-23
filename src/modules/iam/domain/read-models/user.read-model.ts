import { Types } from 'mongoose';

export class UserReadModel {
  _id: Types.ObjectId;
  id: number;
  name: string;
  email: string;
  password: string;
  image: string;
  friends?: Pick<UserReadModel, '_id' | 'id' | 'name' | 'email' | 'image'>[];
  askFriends?: Pick<UserReadModel, '_id' | 'id' | 'name' | 'email' | 'image'>[];
  // friends?: number[];
  // askFriends?: number[];
  createdAt: Date;
  updatedAt: Date;
}
