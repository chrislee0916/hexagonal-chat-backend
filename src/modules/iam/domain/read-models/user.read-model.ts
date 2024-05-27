import { ObjectId } from 'typeorm';

export class UserReadModel {
  _id: ObjectId;
  id: number;
  name: string;
  email: string;
  password: string;
  friends?: Omit<UserReadModel, 'friends' | '_id'>[];
  createdAt: Date;
  updatedAt: Date;
}
