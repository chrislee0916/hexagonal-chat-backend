import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType, PickType } from '@nestjs/swagger';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class MaterializedChatroomView extends Document<Types.ObjectId> {
  @Prop({
    unique: true,
    index: true,
  })
  id: number;

  @Prop()
  name: string;

  @Prop({
    required: false,
  })
  image: string;

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

export const MaterializedChatroomViewSchema = SchemaFactory.createForClass(
  MaterializedChatroomView,
);
