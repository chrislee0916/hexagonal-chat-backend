import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomEntity } from './entities/chatroom.entity';
import { CreateChatroomRepository } from 'src/modules/chat/application/ports/create-chatroom.repository';
import { OrmCreateChatroomRepository } from './repositories/create-chatroom.repository';
import { ChatroomUserEntity } from './entities/chatroom_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatroomEntity, ChatroomUserEntity])],
  providers: [
    {
      provide: CreateChatroomRepository,
      useClass: OrmCreateChatroomRepository,
    },
  ],
  exports: [CreateChatroomRepository],
})
export class OrmChatPersistenceModule {}
