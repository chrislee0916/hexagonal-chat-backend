import { ObjectId } from 'mongodb';

export class UserReadModel {
  _id: ObjectId;
  id: number;
  name: string;
  email: string;
  password: string;
  image: string;
  friends?: Omit<UserReadModel, '_id' | 'friends' | 'password' | 'askFriend'>[];
  askFriends?: Pick<UserReadModel, 'id' | 'name' | 'email' | 'image'>[];
  // friends?: number[];
  // askFriends?: number[];
  createdAt: Date;
  updatedAt: Date;
}
