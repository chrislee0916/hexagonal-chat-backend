import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class MaterializedMessageView extends Document<Types.ObjectId> {
  @Prop({
    unique: true,
    index: true,
  })
  id: number;

  @Prop({
    index: true,
  })
  chatroom_id: number;

  @Prop({
    index: true,
  })
  sender_id: number;

  @Prop({
    required: false,
  })
  image: string;

  @Prop({
    required: false,
  })
  content: string;

  @Prop({
    ref: 'MaterializedUserView',
    type: [MongooseSchema.Types.ObjectId],
  })
  users: Types.ObjectId[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MaterializedMessageViewSchema = SchemaFactory.createForClass(
  MaterializedMessageView,
);
