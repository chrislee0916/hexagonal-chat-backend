import { User } from '../user';

export class UserFactory {
  create(name: string, email: string, password: string) {
    const user = new User(name, email, password);
    return user;
  }
}
