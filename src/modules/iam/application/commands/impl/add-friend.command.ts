export class AskFriendCommand {
  constructor(
    public readonly userId: number,
    public readonly friendId: number,
  ) {}
}
