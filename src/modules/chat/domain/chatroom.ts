import { AggregateRoot } from '@nestjs/cqrs';
import { SentMessageEvent } from './events/sent-message.event';
import { Message } from './message';
import { ChatroomUser } from './chatroom-user';
import { Socket } from 'socket.io';

export class Chatroom extends AggregateRoot {
  public id: number;
  public name: string;
  public users = new Array<ChatroomUser>();
  // public messages = new Array<Message>();
  public message?: Message;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  // * 以下還不確定
  public image: number; // * 為file的外鍵
  public is_group: boolean;

  constructor() {
    super();
  }

  addChatroomUser(userId: number) {
    this.users.push(new ChatroomUser(userId));
  }

  addMessage(senderId: number, content: string) {
    this.message = new Message(this.id, senderId, content);
  }

  sentMessage(socket: Socket) {
    this.apply(new SentMessageEvent(this.message, socket), {
      skipHandler: true,
    });
  }
}
