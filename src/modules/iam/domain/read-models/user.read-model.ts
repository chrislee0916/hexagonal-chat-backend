import { ObjectId } from 'typeorm';

export class UserReadModel {
  _id: ObjectId;
  id: number;
  name: string;
  email: string;
  password: string;
  image: string;
  friends?: Omit<UserReadModel, '_id' | 'friends' | 'password' | 'askFriend'>[];
  askFriends?: Pick<UserReadModel, 'id' | 'name' | 'email' | 'image'>[];
  createdAt: Date;
  updatedAt: Date;
}
