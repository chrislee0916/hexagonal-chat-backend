import { User } from 'src/modules/iam/domain/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    const { name, email, password, askFriends, friends } = userEntity;
    const userModel = new User();
    userModel.id = userEntity.id;
    userModel.name = name;
    userModel.email = email;
    userModel.password = password;
    userModel.askFriends = askFriends;
    userModel.friends = friends;
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
    entity.askFriends = user.askFriends;
    entity.friends = user.friends;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
}
