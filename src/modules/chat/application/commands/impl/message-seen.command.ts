export class MessageSeenCommand {
  constructor(
    public readonly userId: number,
    public readonly chatroomId: number,
    public readonly lastAckId: number,
  ) {}
}
