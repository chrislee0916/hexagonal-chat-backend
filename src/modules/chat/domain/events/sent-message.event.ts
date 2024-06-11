import { Socket } from 'socket.io';
import { Message } from '../message';

export class SentMessageEvent {
  constructor(
    public readonly message: Message,
    public readonly socket: Socket,
  ) {}
}
