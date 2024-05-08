import { User } from '../user';

export class UserFactory {
  create(email: string, password: string) {
    const user = new User(email, password);
    return user;
  }
}
