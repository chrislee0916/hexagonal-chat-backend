import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType, PickType } from '@nestjs/swagger';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { User } from 'src/modules/iam/domain/user';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

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

  // @Prop({
  //   required: false,
  //   type: [OmitType(MaterializedUserView, ['friends', 'password'])],
  // })
  // friends: Omit<MaterializedUserView, 'friends' | 'password'>[];

  // @Prop({
  //   required: false,
  //   type: [PickType(MaterializedUserView, ['id', 'name', 'email', 'image'])],
  // })
  // askFriends: Pick<MaterializedUserView, 'id' | 'name' | 'email' | 'image'>[];

  @Prop({
    required: false,
    ref: 'MaterializedUserView',
    type: [MongooseSchema.Types.ObjectId],
  })
  friends: Types.ObjectId[];

  @Prop({
    required: false,
    ref: 'MaterializedUserView',
    type: [MongooseSchema.Types.ObjectId],
  })
  askFriends: Types.ObjectId[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MaterializedUserViewSchema =
  SchemaFactory.createForClass(MaterializedUserView);
