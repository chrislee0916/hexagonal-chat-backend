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
  MaterializedUserViewDocument,
  MaterializedUserViewSchema,
} from '../schemas/materialized-user-view.schema';
import { Model } from 'mongoose';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { OmitType } from '@nestjs/swagger';
import { MaterializedChatroomView } from 'src/modules/chat/infrastructure/persistence/orm/schemas/materialized-chatroom-view.schema';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';
import {
  ChatroomUser,
  ChatroomUserDocument,
} from 'src/modules/chat/infrastructure/persistence/orm/schemas/chatroom-user.schema';

export class OrmFindUserRepository implements FindUserRepository {
  constructor(
    @InjectModel(MaterializedUserView.name)
    private readonly userModel: Model<MaterializedUserViewDocument>,
    @InjectModel(ChatroomUser.name)
    private readonly chatroomUserModel: Model<ChatroomUser>,
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
    const user = await this.userModel.findOne({ id }).exec();
    const chatroomUsers = await this.chatroomUserModel
      .find({ userId: id })
      .populate('chatroom')
      .exec();

    return {
      ...user.toJSON(),
      chatrooms: chatroomUsers.map((val) => ({
        id: val.chatroomId,
        name: val.chatroom.name,
        image: val.chatroom.image,
        newMessage: val.chatroom.newMessage,
        lastAckId: val.lastAckId,
      })),
    };
  }

  async findOneByObjectId(id: string): Promise<UserReadModel> {
    const user = await this.userModel.findById<UserReadModel>(id);
    // if (!user) {
    //   throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    // }
    return user;
  }
}
