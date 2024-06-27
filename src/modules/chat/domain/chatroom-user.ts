export class ChatroomUser {
  public chatroomId: number;
  public joinedAt: Date;
  public leftAt: Date;
  public name: string;
  public email: string;
  public image: string;
  constructor(public id: number) {}
}
