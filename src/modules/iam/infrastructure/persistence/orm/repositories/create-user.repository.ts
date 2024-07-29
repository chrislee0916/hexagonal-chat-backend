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
import { UserAskedFriendEvent } from 'src/modules/iam/domain/events/user-asked-friend.event';
import { UserAcceptedFriendEvent } from 'src/modules/iam/domain/events/user-accepted-friend.event';
import { InjectModel } from '@nestjs/mongoose';
import {
  MaterializedUserView,
  MaterializedUserViewDocument,
} from '../schemas/materialized-user-view.schema';
import { Model } from 'mongoose';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { find } from 'lodash';

export class OrmCreateUserRepository implements CreateUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserFriendEntity)
    private readonly userFriendRepository: Repository<UserFriendEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(user);
    console.log('persistenceModel: ', persistenceModel);
    const newEntity = await this.userRepository.save(persistenceModel);
    return UserMapper.toDomain(newEntity);
  }

  async askFriend(
    userModel: UserReadModel,
    askedUserModel: UserReadModel,
  ): Promise<UserAskedFriendEvent | UserAcceptedFriendEvent> {
    // * 是否已經是好友狀態
    const existIdx = userModel.friends.findIndex(
      (val) => val.id === askedUserModel.id,
    );
    if (existIdx !== -1) {
      throw new ConflictException(ErrorMsg.ERR_AUTH_USER_ALREADY_FRIEND);
    }
    // * check is already asked before
    const alreadyAsk = askedUserModel.askFriends.findIndex(
      (val) => val.id === userModel.id,
    );
    if (alreadyAsk !== -1) {
      throw new ConflictException(ErrorMsg.ERR_AUTH_ALREADY_ASK_FRIEND);
    }

    // * 如果對方也發送邀請 直接成為好友
    const askedIdx = userModel.askFriends.findIndex(
      (val) => val.id === askedUserModel.id,
    );
    if (askedIdx !== -1) {
      return this.acceptFriend(userModel, askedUserModel);
    }

    try {
      const { generatedMaps } = await this.userFriendRepository.insert({
        userId: askedUserModel.id,
        friendId: userModel.id,
      });

      const newAsk = {
        id: userModel.id,
        name: userModel.name,
        email: userModel.email,
        image: userModel.image,
        updatedAt: generatedMaps[0].updatedAt,
      };

      // * 如果只有發送好友邀請則更新被邀請的部分
      return new UserAskedFriendEvent(
        {
          id: askedUserModel.id,
          askFriends: [...askedUserModel.askFriends, newAsk],
        },
        {
          event: 'newAskFriend',
          userId: askedUserModel.id,
          data: newAsk,
        },
      );
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(ErrorMsg.ERR_AUTH_ALREADY_ASK_FRIEND);
      }

      throw new InternalServerErrorException(ErrorMsg.ERR_CORE_UNKNOWN_ERROR);
    }
  }

  async acceptFriend(
    userModel: UserReadModel,
    askedUserModel: UserReadModel,
  ): Promise<UserAcceptedFriendEvent> {
    // * being friends
    let relations = await this.userFriendRepository.save([
      {
        userId: userModel.id,
        friendId: askedUserModel.id,
        status: 'accepted',
      },
      {
        userId: askedUserModel.id,
        friendId: userModel.id,
        status: 'accepted',
      },
    ]);
    const user = {
      id: userModel.id,
      name: userModel.name,
      email: userModel.email,
      image: userModel.image,
      updatedAt: relations[0].updatedAt,
    };
    const friend = {
      id: askedUserModel.id,
      name: askedUserModel.name,
      email: askedUserModel.email,
      image: askedUserModel.image,
      updatedAt: relations[0].updatedAt,
    };

    // * 如果成為好友則兩個都需更新
    return new UserAcceptedFriendEvent(
      [
        {
          id: userModel.id,
          askFriends: userModel.askFriends.filter(
            (val) => val.id !== friend.id,
          ),
          friends: [...userModel.friends, friend],
        },
        {
          id: askedUserModel.id,
          askFriends: askedUserModel.askFriends.filter(
            (val) => val.id !== userModel.id,
          ),
          friends: [...askedUserModel.friends, user],
        },
      ],
      [
        {
          event: 'newFriend',
          userId: askedUserModel.id,
          data: user,
        },
        {
          event: 'newFriend',
          userId: userModel.id,
          data: friend,
        },
      ],
    );
  }

  private async beingFriends(userId: number, friendId: number): Promise<void> {
    try {
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(ErrorMsg.ERR_AUTH_USER_ALREADY_FRIEND);
      }
      throw new InternalServerErrorException(ErrorMsg.ERR_CORE_UNKNOWN_ERROR);
    }
  }

  // private async getAskFriendAndFriend(userModel: UserEntity): Promise<User> {
  //   // * 取得所有的好友關係資料
  //   try {
  //     const res = await this.userRepository
  //       .createQueryBuilder('user')
  //       .innerJoinAndSelect(UserFriendEntity, 'uf', 'uf.friend_id = user.id')
  //       .select(
  //         'user.id, user.name, user.email, user.image, uf.status, uf.updated_at',
  //       )
  //       .where('uf.user_id = :userId', { userId: userModel.id })
  //       .orderBy('uf.created_at', 'DESC')
  //       .getRawMany<
  //         Pick<UserEntity, 'id' | 'name' | 'email' | 'image'> &
  //           Pick<UserFriendEntity, 'status' | 'updatedAt'>
  //       >();
  //     // * 篩選
  //     return UserMapper.toDomain({
  //       ...userModel,
  //       askFriends: res.filter((val) => val.status === 'pending'),
  //       friends: res.filter((val) => val.status === 'accepted'),
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
