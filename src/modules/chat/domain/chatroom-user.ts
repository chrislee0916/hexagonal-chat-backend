export class ChatroomUser {
  public chatroomId: number;
  public lastAckId: number;
  public joinedAt: Date;
  public leftAt: Date;
  constructor(public id: number) {}
}
