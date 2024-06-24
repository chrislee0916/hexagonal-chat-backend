import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomEntity } from './entities/chatroom.entity';
import { CreateChatroomRepository } from 'src/modules/chat/application/ports/create-chatroom.repository';
import { OrmCreateChatroomRepository } from './repositories/create-chatroom.repository';
import { ChatroomUserEntity } from './entities/chatroom_user.entity';
import { MessageEntity } from './entities/message.entity';
import { UserEntity } from 'src/modules/iam/infrastructure/persistence/orm/entities/user.entity';
import { UpsertMaterializedChatroomRespository } from 'src/modules/chat/application/ports/upsert-materialized-chatroom.respository';
import { OrmUpsertMaterializedChatroomRepository } from './repositories/upsert-materialized-chatroom.respository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MaterializedUserView,
  MaterializedUserViewSchema,
} from 'src/modules/iam/infrastructure/persistence/orm/schemas/materialized-user-view.schema';
import {
  MaterializedChatroomView,
  MaterializedChatroomViewSchema,
} from './schemas/materialized-chatroom-view.schema';
import { CreateMessageRepository } from 'src/modules/chat/application/ports/create-message.repository';
import { OrmCreateMessageRepository } from './repositories/create-message.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatroomEntity,
      ChatroomUserEntity,
      MessageEntity,
      UserEntity,
    ]),
    MongooseModule.forFeature([
      {
        name: MaterializedUserView.name,
        schema: MaterializedUserViewSchema,
      },
      {
        name: MaterializedChatroomView.name,
        schema: MaterializedChatroomViewSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: CreateChatroomRepository,
      useClass: OrmCreateChatroomRepository,
    },
    {
      provide: CreateMessageRepository,
      useClass: OrmCreateMessageRepository,
    },
    {
      provide: UpsertMaterializedChatroomRespository,
      useClass: OrmUpsertMaterializedChatroomRepository,
    },
  ],
  exports: [
    CreateChatroomRepository,
    CreateMessageRepository,
    UpsertMaterializedChatroomRespository,
  ],
})
export class OrmChatPersistenceModule {}
