import { Socket } from 'socket.io';

export class SignInCommand {
  constructor(public readonly socket: Socket) {}
}
