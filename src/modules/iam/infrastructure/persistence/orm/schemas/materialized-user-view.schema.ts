import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType, PickType } from '@nestjs/swagger';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { User } from 'src/modules/iam/domain/user';
import {
  Document,
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';

export type MaterializedUserViewDocument =
  HydratedDocument<MaterializedUserView>;

@Schema({
  timestamps: true,
})
export class MaterializedUserView extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  id: number;

  @Prop()
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({
    required: false,
  })
  image: string;

  @Prop({
    required: false,
    _id: false,
    type: [
      {
        id: Number,
        name: String,
        email: String,
        image: String,
      },
    ],
  })
  friends: Array<{
    id: number;
    name: string;
    email: string;
    image: string;
  }>;

  @Prop({
    required: false,
    _id: false,
    type: [
      {
        id: Number,
        name: String,
        email: String,
        image: String,
      },
    ],
  })
  askFriends: Array<{
    id: number;
    name: string;
    email: string;
    image: string;
  }>;

  @Prop({
    required: false,
    _id: false,
    type: [
      {
        id: Number,
        name: String,
        image: String,
      },
    ],
  })
  chatrooms: Array<{
    id: number;
    name: string;
    image: string;
  }>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MaterializedUserViewSchema =
  SchemaFactory.createForClass(MaterializedUserView);
