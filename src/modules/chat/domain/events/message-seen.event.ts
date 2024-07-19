import { ChatroomUser } from '../chatroom-user';

export class MessageSeenEvent {
  constructor(
    public readonly userId: number,
    public readonly chatroomId: number,
    public readonly lastAckId: number,
  ) {}
}
