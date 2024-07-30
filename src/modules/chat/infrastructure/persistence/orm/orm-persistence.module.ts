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
import { UpsertMaterializedMessageRespository } from 'src/modules/chat/application/ports/upsert-materialized-message.respository';
import { OrmUpsertMaterializedMessageRepository } from './repositories/upsert-materialized-message.repository';
import {
  MaterializedMessageView,
  MaterializedMessageViewSchema,
} from './schemas/materialized-message-view.schema';
import { FindMaterializedChatroomRepository } from 'src/modules/chat/application/ports/find-materialized-chatroom.repository';
import { OrmFindChatroomRepository } from './repositories/find-materialized-chatroom.repository';
import { FindMessageRepository } from 'src/modules/chat/application/ports/find-message.repository';
import { OrmFindMessageRepository } from './repositories/find-message.repository';
import {
  ChatroomUser,
  ChatroomUserSchema,
} from './schemas/chatroom-user.schema';
import { UpdateChatroomUserRepository } from 'src/modules/chat/application/ports/update-chatroom-user';
import { OrmUpdateChatroomUserRepository } from './repositories/update-chatroom-user.repository';

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
        name: ChatroomUser.name,
        schema: ChatroomUserSchema,
      },
      {
        name: MaterializedChatroomView.name,
        schema: MaterializedChatroomViewSchema,
      },
      {
        name: MaterializedMessageView.name,
        schema: MaterializedMessageViewSchema,
      },
      {
        name: MaterializedUserView.name,
        schema: MaterializedUserViewSchema,
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
      provide: FindMaterializedChatroomRepository,
      useClass: OrmFindChatroomRepository,
    },
    {
      provide: FindMessageRepository,
      useClass: OrmFindMessageRepository,
    },
    {
      provide: UpdateChatroomUserRepository,
      useClass: OrmUpdateChatroomUserRepository,
    },
    {
      provide: UpsertMaterializedChatroomRespository,
      useClass: OrmUpsertMaterializedChatroomRepository,
    },
    {
      provide: UpsertMaterializedMessageRespository,
      useClass: OrmUpsertMaterializedMessageRepository,
    },
  ],
  exports: [
    CreateChatroomRepository,
    CreateMessageRepository,
    FindMaterializedChatroomRepository,
    FindMessageRepository,
    UpdateChatroomUserRepository,
    UpsertMaterializedChatroomRespository,
    UpsertMaterializedMessageRespository,
  ],
})
export class OrmChatPersistenceModule {}
