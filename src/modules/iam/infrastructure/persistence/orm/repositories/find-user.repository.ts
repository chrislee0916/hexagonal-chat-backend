import { InjectRepository } from '@nestjs/typeorm';
import { FindUserRepository } from 'src/modules/iam/application/ports/find-user.repository';
import { User } from 'src/modules/iam/domain/user';
import { UserEntity } from '../entities/user.entity';
import { In, Repository } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { UserMapper } from '../mappers/user.mapper';
import { InjectModel } from '@nestjs/mongoose';
import {
  MaterializedUserView,
  MaterializedUserViewSchema,
} from '../schemas/materialized-user-view.schema';
import { Model } from 'mongoose';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { OmitType } from '@nestjs/swagger';
import { MaterializedChatroomView } from 'src/modules/chat/infrastructure/persistence/orm/schemas/materialized-chatroom-view.schema';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';

export class OrmFindUserRepository implements FindUserRepository {
  constructor(
    // @InjectRepository(UserEntity)
    // private readonly userRepository: Repository<UserEntity>
    @InjectModel(MaterializedUserView.name)
    private readonly userModel: Model<MaterializedUserView>,
    @InjectModel(MaterializedChatroomView.name)
    private readonly chatroomModel: Model<MaterializedChatroomView>,
  ) {}

  async findOneByEmail(email: string): Promise<UserReadModel> {
    // const userEntity = await this.userRepository.findOneBy({ email });
    const user = await this.userModel.findOne<UserReadModel>({ email }).exec();
    // if (!user) {
    //   throw new UnauthorizedException(ErrorMsg.ERR_AUTH_SIGNIN_NOT_EXIST);
    // }
    return user;
    // return UserMapper.toDomain(user);
  }

  async findOneById(id: number): Promise<UserReadModel> {
    // const userEntity = await this.userRepository.findOneBy({ id });

    const user = await this.userModel.findOne<MaterializedUserView>({ id });
    console.log('usssser: ', user);
    const chatrooms = await this.chatroomModel.find<
      Pick<ChatroomReadModel, 'id' | 'name' | 'image' | 'newMessage'>
    >({ id: { $in: user.chatrooms } }, 'id name image newMessage');
    console.log('finddd chatrooms: ', chatrooms);
    return {
      _id: user._id,
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
      friends: user.friends,
      askFriends: user.askFriends,
      chatrooms,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    // return UserMapper.toDomain(user);
  }

  async findOneByObjectId(id: string): Promise<UserReadModel> {
    const user = await this.userModel.findById<UserReadModel>(id);
    // if (!user) {
    //   throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    // }
    return user;
  }
}
