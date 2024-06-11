import { Injectable } from '@nestjs/common';
import { Chatroom } from '../chatroom';

@Injectable()
export class ChatroomFactory {
  create(name: string, userIds: number[]) {
    let chatroom = new Chatroom();
    chatroom.name = name;
    userIds.forEach((userId) => {
      chatroom.addChatroomUser(userId);
    });
    return chatroom;
  }
}
