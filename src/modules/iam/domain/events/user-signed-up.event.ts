import { User } from '../user';

export class UserSignedUpEvent {
  constructor(public readonly user: User) {}
}
