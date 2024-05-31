import { Socket } from 'socket.io';

export class SignOutCommand {
  constructor(public readonly socket: Socket) {}
}
