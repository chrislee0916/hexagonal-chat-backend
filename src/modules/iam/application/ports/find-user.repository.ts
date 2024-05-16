import { User } from "../../domain/user";


export abstract class FindUserRepository {
  abstract findOneByEmail(email: string): Promise<User>
  abstract findOneById(id: number): Promise<User>
}