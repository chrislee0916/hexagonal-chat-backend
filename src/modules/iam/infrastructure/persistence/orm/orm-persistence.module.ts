import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserRepository } from 'src/modules/iam/application/ports/create-user.repository';
import { OrmCreateUserRepository } from './repositories/create-user.repository';
import { FindUserRepository } from 'src/modules/iam/application/ports/find-user.repository';
import { OrmFindUserRepository } from './repositories/find-materialized-user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MaterializedUserView,
  MaterializedUserViewSchema,
} from './schemas/materialized-user-view.schema';
import { UpsertMaterializedUserRepository } from 'src/modules/iam/application/ports/upsert-materialized-user.repository';
import { OrmUpsertMaterializedUserRepository } from './repositories/upsert-materialized-user.respository';
import { UserFriendEntity } from './entities/user-friend.entity';
import {
  MaterializedChatroomView,
  MaterializedChatroomViewSchema,
} from 'src/modules/chat/infrastructure/persistence/orm/schemas/materialized-chatroom-view.schema';
import {
  ChatroomUserSchema,
  ChatroomUser,
} from 'src/modules/chat/infrastructure/persistence/orm/schemas/chatroom-user.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserFriendEntity]),
    MongooseModule.forFeature([
      {
        name: MaterializedUserView.name,
        schema: MaterializedUserViewSchema,
      },
      {
        name: MaterializedChatroomView.name,
        schema: MaterializedChatroomViewSchema,
      },
      {
        name: ChatroomUser.name,
        schema: ChatroomUserSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: CreateUserRepository,
      useClass: OrmCreateUserRepository,
    },
    {
      provide: FindUserRepository,
      useClass: OrmFindUserRepository,
    },
    {
      provide: UpsertMaterializedUserRepository,
      useClass: OrmUpsertMaterializedUserRepository,
    },
  ],
  exports: [
    CreateUserRepository,
    FindUserRepository,
    UpsertMaterializedUserRepository,
  ],
})
export class OrmIamPersistenceModule {}
