import { Socket } from 'socket.io';

export class SignInCommand {
  constructor(
    public readonly userId: number,
    public readonly socketId: string,
  ) {}
}
