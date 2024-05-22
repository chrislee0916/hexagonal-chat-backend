import { User } from 'src/modules/iam/domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    const { name, email, password } = userEntity;
    const userModel = new User(name, email, password);
    userModel.id = userEntity.id;
    userModel.createdAt = userEntity.createdAt;
    userModel.updatedAt = userEntity.updatedAt;
    userModel.deletedAt = userEntity.deletedAt;
    return userModel;
  }

  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.name = user.name;
    entity.email = user.email;
    entity.password = user.password;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    entity.deletedAt = user.deletedAt;
    return entity;
  }
}
