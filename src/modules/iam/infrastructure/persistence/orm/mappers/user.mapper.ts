import { User } from 'src/modules/iam/domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    const { name, email, password } = userEntity;
    const userModel = new User(name, email, password);
    userModel.id = userEntity.id;
    return userModel;
  }

  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.name = user.name;
    entity.email = user.email;
    entity.password = user.password;
    return entity;
  }
}
