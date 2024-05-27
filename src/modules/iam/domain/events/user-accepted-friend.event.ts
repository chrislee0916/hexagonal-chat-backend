export class UserAcceptedFriendEvent {
  constructor(
    public readonly userId: number,
    public readonly friendId: number,
  ) {}
}
