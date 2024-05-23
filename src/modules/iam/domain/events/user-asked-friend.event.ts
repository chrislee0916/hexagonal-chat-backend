export class UserAskedFriendEvent {
  constructor(
    public readonly userId: number,
    public readonly friendId: number,
  ) {}
}
