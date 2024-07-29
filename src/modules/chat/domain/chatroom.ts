import { AggregateRoot } from '@nestjs/cqrs';
import { SentMessageEvent } from './events/sent-message.event';
import { Message } from './message';
import { ChatroomUser } from './chatroom-user';
import { Socket } from 'socket.io';
import { CreatedChatroomEvent } from './events/created-chatroom.event';
import { ChatroomUserEntity } from '../infrastructure/persistence/orm/entities/chatroom_user.entity';

export class Chatroom extends AggregateRoot {
  public id: number;
  public name: string;
  public image: string;
  public users = new Array<ChatroomUser>();
  // public messages = new Array<Message>();
  public newMessage?: Message;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;

  constructor() {
    super();
  }

  addChatroomUser(id: number) {
    this.users.push(new ChatroomUser(id));
  }

  addNewMessage(senderId: number, image?: string, content?: string) {
    this.newMessage = new Message(this.id, senderId, image, content);
  }

  created() {
    this.apply(new CreatedChatroomEvent(this), { skipHandler: true });
  }

  sentMessage(socket: Socket) {
    this.apply(new SentMessageEvent(this.newMessage, socket), {
      skipHandler: true,
    });
  }
}
