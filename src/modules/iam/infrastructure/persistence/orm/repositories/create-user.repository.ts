import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRepository } from 'src/modules/iam/application/ports/create-user.repository';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { User } from 'src/modules/iam/domain/user';
import { UserFriendEntity } from '../entities/user-friend.entity';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async askFriend(userId: number, friendEmail: string): Promise<[User, User]> {
    // * 判斷要加入的 friend 是否存在
    const friendModel = await this.userRepository.findOneBy({
      email: friendEmail,
    });
    if (!friendModel) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    }
    // * 是否為同個人
    if (userId === friendModel.id) {
      throw new BadRequestException(ErrorMsg.ERR_AUTH_ASK_FRIEND_TO_MYSELF);
    }

    // * 判斷 user 是否存在
    const userModel = await this.userRepository.findOneBy({ id: userId });
    if (!userModel) {
      throw new UnauthorizedException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    }

    // * 是否已經是好友狀態
    const alreadyExist = await this.userFriendRepository.findOneBy({
      userId,
      friendId: friendModel.id,
      status: 'accepted',
    });
    if (alreadyExist) {
      throw new ConflictException(ErrorMsg.ERR_AUTH_USER_ALREADY_FRIEND);
    }

    // * 如果對方也發送邀請 直接成為好友
    let friendAsked = await this.userFriendRepository.findOneBy({
      userId,
      friendId: friendModel.id,
      status: 'pending',
    });

    if (friendAsked) {
      await this.beingFriends(userId, friendModel.id);
      return [UserMapper.toDomain(userModel), UserMapper.toDomain(friendModel)];
    }

    try {
      await this.userFriendRepository.insert({
        userId: friendModel.id,
        friendId: userId,
      });
      return [UserMapper.toDomain(userModel), UserMapper.toDomain(friendModel)];
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(ErrorMsg.ERR_AUTH_ALREADY_ASK_FRIEND);
      }
      throw new InternalServerErrorException(ErrorMsg.ERR_CORE_UNKNOWN_ERROR);
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
      throw new InternalServerErrorException(ErrorMsg.ERR_CORE_UNKNOWN_ERROR);
    }
  }
}
