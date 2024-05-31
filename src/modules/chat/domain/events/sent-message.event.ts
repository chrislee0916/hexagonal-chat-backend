export class SentMessageEvent {
  constructor(
    public readonly chatroomId: number,
    public readonly userId: number,
    public readonly content: string,
  ) {}
}
