import { InjectRepository } from '@nestjs/typeorm';
import { UpdateChatroomUserRepository } from 'src/modules/chat/application/ports/update-chatroom-user';
import { ChatroomUser as DomainChatroomUser } from 'src/modules/chat/domain/chatroom-user';
import { ChatroomUserEntity } from '../entities/chatroom_user.entity';
import { Repository } from 'typeorm';
import { ChatroomUserMapper } from '../mappers/chatroom-user.mapper';
import { InjectModel } from '@nestjs/mongoose';
import {
  ChatroomUserDocument,
  ChatroomUser,
} from '../schemas/chatroom-user.schema';
import { Model } from 'mongoose';

export class OrmUpdateChatroomUserRepository
  implements UpdateChatroomUserRepository
{
  constructor(
    @InjectModel(ChatroomUser.name)
    private readonly chatroomUserModel: Model<ChatroomUserDocument>,

    @InjectRepository(ChatroomUserEntity)
    private readonly userRepository: Repository<ChatroomUserEntity>,
  ) {}
  async update(chatroomUsers: DomainChatroomUser[]): Promise<void> {
    await this.userRepository.save(
      chatroomUsers.map((val) => ChatroomUserMapper.toPersistence(val)),
    );

    // return entities.map((val) => ChatroomUserMapper.toDomain(val));
    await this.chatroomUserModel.bulkWrite(
      chatroomUsers.map((val) => {
        return {
          updateOne: {
            filter: { chatroomId: val.chatroomId, userId: val.userId },
            update: {
              lastAckId: val.lastAckId,
            },
            upsert: true,
          },
        };
      }),
    );
  }
}
