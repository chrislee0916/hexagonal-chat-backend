import { InjectRepository } from '@nestjs/typeorm';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { Repository } from 'typeorm';
import { MessageEntity } from '../entities/message.entity';
import { MessageMapper } from '../mappers/message.mapper';
import { CreateMessageRepository } from 'src/modules/chat/application/ports/create-message.repository';

export class OrmCreateMessageRepository implements CreateMessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async save(chatroom: Chatroom): Promise<Chatroom> {
    const persistenceModel = MessageMapper.toPersistence(chatroom.newMessage);
    const newEntity = await this.messageRepository.save(persistenceModel);
    chatroom.newMessage = MessageMapper.toDomain(newEntity);
    return chatroom;
  }
}
