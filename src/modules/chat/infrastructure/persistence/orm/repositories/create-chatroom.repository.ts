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

export class OrmCreateChatroomRepository implements CreateChatroomRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async save(chatroom: Chatroom): Promise<Chatroom> {
    // * 檢查 users 是否都存在
    const [_, count] = await this.userRepository.findAndCountBy({
      id: In(chatroom.users.flatMap((val) => val.userId)),
    });
    if (count !== chatroom.users.length) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    }

    // * 開始執行建立 chatroom 的 transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const persistenceModel = ChatroomMapper.toPersistence(chatroom);
      const newEntity = await queryRunner.manager.save(persistenceModel);

      const chatroomUsers = chatroom.users.map((user) => {
        user.chatroomId = newEntity.id;
        return ChatroomUserMapper.toPersistence(user);
      });
      await queryRunner.manager.save(chatroomUsers);

      await queryRunner.commitTransaction();

      chatroom.id = newEntity.id;
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
