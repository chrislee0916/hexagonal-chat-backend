import { Injectable } from '@nestjs/common';
import { Chatroom } from '../chatroom';

@Injectable()
export class ChatroomFactory {
  create(name: string) {
    let chatroom = new Chatroom();
    chatroom.name = name;
    return chatroom;
  }
}
