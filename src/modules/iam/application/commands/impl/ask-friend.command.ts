export class AskFriendCommand {
  constructor(
    public readonly userId: number,
    public readonly friendEmail: string,
  ) {}
}
