import { User } from '../user';

export class UserFactory {
  create(name: string, email: string, password: string): User {
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    return user;
  }
}
