import { AggregateRoot } from '@nestjs/cqrs';
import { UserSignedUpEvent } from './events/user-signed-up.event';

export class User extends AggregateRoot {
  public id: number;

  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {
    super();
  }

  signedUp() {
    this.apply(new UserSignedUpEvent(this), { skipHandler: true });
  }
}
