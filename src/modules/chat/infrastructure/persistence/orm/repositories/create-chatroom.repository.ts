import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatroomRepository } from 'src/modules/chat/application/ports/create-chatroom.repository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { ChatroomEntity } from '../entities/chatroom.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ChatroomMapper } from '../mappers/chatroom.mapper';
import { ChatroomUserEntity } from '../entities/chatroom_user.entity';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { Message } from 'src/modules/chat/domain/message';
import { MessageEntity } from '../entities/message.entity';
import { MessageMapper } from '../mappers/message.mapper';
import { ChatroomUserMapper } from '../mappers/chatroom-user.mapper';

export class OrmCreateChatroomRepository implements CreateChatroomRepository {
  constructor(
    @InjectRepository(ChatroomEntity)
    private readonly chatroomRepository: Repository<ChatroomEntity>,
    @InjectRepository(ChatroomUserEntity)
    private readonly chatroomUserRepository: Repository<ChatroomUserEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private dataSource: DataSource,
  ) {}

  async saveMessage(chatroom: Chatroom): Promise<Chatroom> {
    const persistenceModel = MessageMapper.toPersistence(chatroom.message);
    const newEntity = await this.messageRepository.save(persistenceModel);
    chatroom.message = MessageMapper.toDomain(newEntity);
    return chatroom;
  }

  async save(chatroom: Chatroom): Promise<Chatroom> {
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

      return ChatroomMapper.toDomain(newEntity);
      // let res = ChatroomMapper.toDomain(newEntity);
      // res.users = chatroomUsers.map((user) =>
      //   ChatroomUserMapper.toDomain(user),
      // );
      // return res;
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
