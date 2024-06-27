import { Types } from 'mongoose';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';

export class ChatroomReadModel {
  _id: Types.ObjectId;
  id: number;
  name: string;
  image: string;
  users: Pick<UserReadModel, 'id' | 'name' | 'email' | 'image'>;
}
