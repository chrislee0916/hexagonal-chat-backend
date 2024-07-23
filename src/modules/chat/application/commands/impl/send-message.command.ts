import { Socket } from 'socket.io';

export class SendMessageCommand {
  constructor(
    public readonly chatroomId: number,
    public readonly socket: Socket,
    public readonly image?: string,
    public readonly content?: string,
  ) {}
}
