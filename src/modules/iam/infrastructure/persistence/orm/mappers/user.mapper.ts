import { User } from 'src/modules/iam/domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    const { name, email, password } = userEntity;
    const userModel = new User();
    userModel.id = userEntity.id;
    userModel.name = name;
    userModel.email = email;
    userModel.password = password;
    userModel.createdAt = userEntity.createdAt;
    userModel.updatedAt = userEntity.updatedAt;
    return userModel;
  }

  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.name = user.name;
    entity.email = user.email;
    entity.password = user.password;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
}
