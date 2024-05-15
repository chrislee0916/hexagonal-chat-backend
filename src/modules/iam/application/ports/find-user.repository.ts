import { User } from "../../domain/user";


export abstract class FindUserRepository {
  abstract findByEmail(email: string): Promise<User>
}