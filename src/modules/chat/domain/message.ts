export class Message {
  public id: number;
  public createdAt: Date;
  constructor(
    public chatroomId: number,
    public senderId: number,
    public content: string,
  ) {}
}
