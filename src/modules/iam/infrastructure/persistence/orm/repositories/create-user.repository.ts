import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRepository } from 'src/modules/iam/application/ports/create-user.repository';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { User } from 'src/modules/iam/domain/user';

export class OrmCreateUserRepository implements CreateUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(user);
    const newEntity = await this.userRepository.save(persistenceModel);
    return UserMapper.toDomain(newEntity);
  }
}
