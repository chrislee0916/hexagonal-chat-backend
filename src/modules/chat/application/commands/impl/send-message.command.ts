import { Socket } from 'socket.io';

export class SendMessageCommand {
  constructor(
    public readonly chatroomId: number,
    public readonly userId: number,
    public readonly socket: Socket,
    public readonly content: string,
  ) {}
}
