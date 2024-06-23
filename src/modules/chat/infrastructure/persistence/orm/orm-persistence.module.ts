import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomEntity } from './entities/chatroom.entity';
import { CreateChatroomRepository } from 'src/modules/chat/application/ports/create-chatroom.repository';
import { OrmCreateChatroomRepository } from './repositories/create-chatroom.repository';
import { ChatroomUserEntity } from './entities/chatroom_user.entity';
import { MessageEntity } from './entities/message.entity';
import { UserEntity } from 'src/modules/iam/infrastructure/persistence/orm/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatroomEntity,
      ChatroomUserEntity,
      MessageEntity,
      UserEntity,
    ]),
  ],
  providers: [
    {
      provide: CreateChatroomRepository,
      useClass: OrmCreateChatroomRepository,
    },
  ],
  exports: [CreateChatroomRepository],
})
export class OrmChatPersistenceModule {}
