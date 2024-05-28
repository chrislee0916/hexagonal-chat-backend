import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatroomRepository } from 'src/modules/chat/application/ports/create-chatroom.repository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { ChatroomEntity } from '../entities/chatroom.entity';
import { Repository } from 'typeorm';
import { ChatroomMapper } from '../mappers/chatroom.mapper';
import { ChatroomUserEntity } from '../entities/chatroom_user.entity';

export class OrmCreateChatroomRepository implements CreateChatroomRepository {
  constructor(
    @InjectRepository(ChatroomEntity)
    private readonly chatroomRepository: Repository<ChatroomEntity>,
    @InjectRepository(ChatroomUserEntity)
    private readonly chatroomUserRepository: Repository<ChatroomUserEntity>,
  ) {}

  async save(chatroom: Chatroom): Promise<Chatroom> {
    const persistenceModel = ChatroomMapper.toPersistence(chatroom);
    const newEntity = await this.chatroomRepository.save(persistenceModel);
    return ChatroomMapper.toDomain(newEntity);
  }

  async addUsers(chatroomId: number, userIds: number[]): Promise<void> {
    const persistenceModels = userIds.map(
      (userId): Partial<ChatroomUserEntity> => ({
        chatroomId,
        userId,
      }),
    );
    await this.chatroomUserRepository.insert(persistenceModels);
  }
}
