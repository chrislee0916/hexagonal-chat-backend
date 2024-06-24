import { Chatroom } from '../chatroom';

export class CreatedChatroomEvent {
  constructor(public readonly chatroom: Chatroom) {}
}
