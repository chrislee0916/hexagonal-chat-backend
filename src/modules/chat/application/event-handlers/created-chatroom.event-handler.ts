import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreatedChatroomEvent } from '../../domain/events/created-chatroom.event';
import { Logger } from '@nestjs/common';
import { UpsertMaterializedChatroomRespository } from '../ports/upsert-materialized-chatroom.respository';
import { UpsertMaterializedUserRepository } from 'src/modules/iam/application/ports/upsert-materialized-user.repository';

@EventsHandler(CreatedChatroomEvent)
export class CreatedChatroomEventHandler
  implements IEventHandler<CreatedChatroomEvent>
{
  private readonly logger = new Logger(CreatedChatroomEventHandler.name);

  constructor(
    private readonly upsertMaterializedChatroomRepository: UpsertMaterializedChatroomRespository,
    private readonly upsertMaterializedUserRepository: UpsertMaterializedUserRepository,
  ) {}

  async handle(event: CreatedChatroomEvent): Promise<void> {
    this.logger.log(`Created chatroom event: ${JSON.stringify(event)}`);

    // * 同步資料到 read db
    console.log('not goo');
    await this.upsertMaterializedChatroomRepository.upsert({
      id: event.chatroom.id,
      name: event.chatroom.name,
      users: event.chatroom.users,
    });
    console.log('om');
    await this.upsertMaterializedUserRepository.upsertMany(
      event.chatroom.users,
    );

    // * socket 通知其他被加入的的使用者
  }
}
