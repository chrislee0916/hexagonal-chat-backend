import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MaterializedChatroomView } from './materialized-chatroom-view.schema';
import { MaterializedUserView } from 'src/modules/iam/infrastructure/persistence/orm/schemas/materialized-user-view.schema';

export type ChatroomUserDocument = HydratedDocument<ChatroomUser>;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class ChatroomUser {
  @Prop({
    index: true,
  })
  userId: number;

  user: {
    id: number;
    name: string;
    email: string;
    image: string;
    joinedAt: Date;
    lastAckId: number;
  };

  @Prop({
    index: true,
  })
  chatroomId: number;

  chatroom: {
    id: number;
    name: string;
    image: string;
    joinedAt: Date;
    lastAckId: number;
    newMessage: any;
  };

  @Prop({
    index: true,
  })
  lastAckId: number;

  @Prop()
  joinedAt: Date;

  @Prop()
  leftAt: Date;
}

export const ChatroomUserSchema = SchemaFactory.createForClass(ChatroomUser);
ChatroomUserSchema.index({ chatroomId: 1, userId: 1 });

ChatroomUserSchema.virtual('chatroom', {
  ref: MaterializedChatroomView.name,
  localField: 'chatroomId',
  foreignField: 'id',
  justOne: true,
});

ChatroomUserSchema.virtual('user', {
  ref: MaterializedUserView.name,
  localField: 'userId',
  foreignField: 'id',
  justOne: true,
});
