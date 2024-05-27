export class AcceptFriendCommand {
  constructor(
    public readonly userId: number,
    public readonly friendId: number,
  ) {}
}
