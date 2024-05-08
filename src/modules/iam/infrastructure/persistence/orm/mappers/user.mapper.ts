import { User } from 'src/modules/iam/domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    const { email, password } = userEntity;
    const userModel = new User(email, password);
    userModel.id = userEntity.id;
    return userModel;
  }

  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.email = user.email;
    entity.password = user.password;
    return entity;
  }
}
