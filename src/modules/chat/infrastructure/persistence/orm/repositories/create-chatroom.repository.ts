import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatroomRepository } from 'src/modules/chat/application/ports/create-chatroom.repository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { DataSource, In, Repository } from 'typeorm';
import { ChatroomMapper } from '../mappers/chatroom.mapper';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { ChatroomUserMapper } from '../mappers/chatroom-user.mapper';
import { UserEntity } from 'src/modules/iam/infrastructure/persistence/orm/entities/user.entity';
import { ChatroomUserEntity } from '../entities/chatroom_user.entity';

export class OrmCreateChatroomRepository implements CreateChatroomRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async save(chatroom: Chatroom): Promise<Chatroom> {
    // * 檢查 users 是否都存在
    const userModels = await this.userRepository.find({
      where: {
        id: In(chatroom.users.flatMap((val) => val.id)),
      },
    });
    if (userModels.length !== chatroom.users.length) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    }

    // * 開始執行建立 chatroom 的 transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const persistenceModel = ChatroomMapper.toPersistence(chatroom);
      const newEntity = await queryRunner.manager.save(persistenceModel);

      await queryRunner.manager.save<ChatroomUserEntity>(
        chatroom.users.map((user) => {
          let val = new ChatroomUserEntity();
          val.chatroomId = newEntity.id;
          val.userId = user.id;
          return val;
        }),
      );

      await queryRunner.commitTransaction();

      chatroom.id = newEntity.id;
      chatroom.users = userModels.map(({ id, name, email, image }) => {
        return { id, name, email, image };
      });
      return chatroom;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err.code === '23503') {
        throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
      }
      console.log(err);
      throw new InternalServerErrorException(ErrorMsg.ERR_CORE_UNKNOWN_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
}
