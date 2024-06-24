import { AggregateRoot } from '@nestjs/cqrs';
import { SentMessageEvent } from './events/sent-message.event';
import { Message } from './message';
import { ChatroomUser } from './chatroom-user';
import { Socket } from 'socket.io';
import { CreatedChatroomEvent } from './events/created-chatroom.event';

export class Chatroom extends AggregateRoot {
  public id: number;
  public name: string;
  // public image: number; // * 為file的外鍵
  public users = new Array<ChatroomUser>();
  // public messages = new Array<Message>();
  public message?: Message;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;

  constructor() {
    super();
  }

  addChatroomUser(userId: number) {
    this.users.push(new ChatroomUser(userId));
  }

  addMessage(senderId: number, content: string) {
    this.message = new Message(this.id, senderId, content);
  }

  created() {
    this.apply(new CreatedChatroomEvent(this), { skipHandler: true });
  }

  sentMessage(socket: Socket) {
    this.apply(new SentMessageEvent(this.message, socket), {
      skipHandler: true,
    });
  }
}
