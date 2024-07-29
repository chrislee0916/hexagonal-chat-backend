import { ActiveUserData } from 'src/modules/iam/domain/interfaces/active-user-data.interface';

export class AskFriendCommand {
  constructor(
    public readonly userData: ActiveUserData,
    public readonly friendEmail: string,
  ) {}
}
