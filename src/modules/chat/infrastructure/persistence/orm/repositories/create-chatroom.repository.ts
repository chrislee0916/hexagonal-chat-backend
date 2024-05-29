import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatroomRepository } from 'src/modules/chat/application/ports/create-chatroom.repository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { ChatroomEntity } from '../entities/chatroom.entity';
import { DataSource, Repository } from 'typeorm';
import { ChatroomMapper } from '../mappers/chatroom.mapper';
import { ChatroomUserEntity } from '../entities/chatroom_user.entity';
import { NotFoundException } from '@nestjs/common';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';

export class OrmCreateChatroomRepository implements CreateChatroomRepository {
  constructor(
    @InjectRepository(ChatroomEntity)
    private readonly chatroomRepository: Repository<ChatroomEntity>,
    @InjectRepository(ChatroomUserEntity)
    private readonly chatroomUserRepository: Repository<ChatroomUserEntity>,
    private dataSource: DataSource,
  ) {}

  async save(chatroom: Chatroom, userIds: number[]): Promise<Chatroom> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const persistenceModel = ChatroomMapper.toPersistence(chatroom);

      // const newEntity = await this.chatroomRepository.save(persistenceModel);
      const newEntity = await queryRunner.manager.save(persistenceModel);
      const chatroomUsers = userIds.map((userId): ChatroomUserEntity => {
        let chatroomUser = new ChatroomUserEntity();
        chatroomUser.chatroomId = newEntity.id;
        chatroomUser.userId = userId;
        return chatroomUser;
      });
      // await this.chatroomUserRepository.save(chatroomUsers);
      await this.dataSource.manager.save(chatroomUsers);
      await queryRunner.commitTransaction();
      return ChatroomMapper.toDomain(newEntity);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err.code === '23503') {
        throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
      }
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // async addUsers(chatroomId: number, userIds: number[]): Promise<void> {
  //   const persistenceModels = userIds.map(
  //     (userId): Partial<ChatroomUserEntity> => ({
  //       chatroomId,
  //       userId,
  //     }),
  //   );
  //   await this.chatroomUserRepository.insert(persistenceModels);
  // }
}
