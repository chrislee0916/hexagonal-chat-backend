export class CreateGroupChatroomCommand {
  constructor(
    public readonly name: string,
    public readonly userIds: number[],
  ) {}
}

export class CreateSingleChatroomCommand {
  constructor(
    public readonly name: string,
    public readonly userId: number,
    public readonly friendId: number,
  ) {}
}
