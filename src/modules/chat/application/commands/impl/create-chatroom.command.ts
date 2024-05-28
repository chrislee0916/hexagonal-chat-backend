export class CreateChatroomCommand {
  constructor(
    public readonly name: string,
    public readonly userIds: number[],
  ) {}
}
