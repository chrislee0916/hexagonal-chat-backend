import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/swagger';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { User } from 'src/modules/iam/domain/user';

@Schema({
  timestamps: true,
})
export class MaterializedUserView {
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
    type: [OmitType(MaterializedUserView, ['friends'])],
  })
  friends: Omit<MaterializedUserView, 'friends'>[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MaterializedUserViewSchema =
  SchemaFactory.createForClass(MaterializedUserView);
