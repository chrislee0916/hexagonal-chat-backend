import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType, PickType } from '@nestjs/swagger';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import {
  Document,
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { MaterializedUserView } from 'src/modules/iam/infrastructure/persistence/orm/schemas/materialized-user-view.schema';

export type MaterializedChatroomViewDocument =
  HydratedDocument<MaterializedChatroomView>;
@Schema({
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class MaterializedChatroomView {
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
    _id: false,
    type: {
      id: Number,
      chatroomId: Number,
      senderId: Number,
      image: String,
      content: String,
      createdAt: Date,
    },
  })
  newMessage: {
    id: number;
    chatroomId: number;
    senderId: number;
    image: string;
    content: string;
    createdAt: Date;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MaterializedChatroomViewSchema = SchemaFactory.createForClass(
  MaterializedChatroomView,
);
