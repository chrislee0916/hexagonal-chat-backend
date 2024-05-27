import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRepository } from 'src/modules/iam/application/ports/create-user.repository';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { User } from 'src/modules/iam/domain/user';
import { UserFriendEntity } from '../entities/user-friend.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';

export class OrmCreateUserRepository implements CreateUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserFriendEntity)
    private readonly userFriendRepository: Repository<UserFriendEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(user);
    const newEntity = await this.userRepository.save(persistenceModel);
    return UserMapper.toDomain(newEntity);
  }

  async askFriend(userId: number, friendId: number): Promise<void> {
    let friendAsked = await this.userFriendRepository.findOneBy({
      userId: friendId,
      friendId: userId,
      status: 'pending',
    });

    if (friendAsked) {
      await this.beingFriends(userId, friendId);
      return;
    }

    try {
      await this.userFriendRepository.insert({
        userId,
        friendId,
      });
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(ErrorMsg.ERR_AUTH_ALREADY_ASK_FRIEND);
      }
      throw err;
    }
  }

  async acceptFriend(userId: number, friendId: number): Promise<void> {
    const askFriend = await this.userFriendRepository.findOneBy({
      userId: friendId,
      friendId: userId,
      status: 'pending',
    });
    if (!askFriend) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_ASK_FRIEND_NOT_FOUND);
    }
    await this.beingFriends(userId, friendId);
  }

  private async beingFriends(userId: number, friendId: number): Promise<void> {
    try {
      await this.userFriendRepository.save([
        {
          userId,
          friendId,
          status: 'accepted',
        },
        {
          userId: friendId,
          friendId: userId,
          status: 'accepted',
        },
      ]);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(ErrorMsg.ERR_AUTH_USER_ALREADY_FRIEND);
      }
    }
  }
}
