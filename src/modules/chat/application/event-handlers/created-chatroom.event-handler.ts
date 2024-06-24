import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreatedChatroomEvent } from '../../domain/events/created-chatroom.event';
import { Logger } from '@nestjs/common';
import { UpsertMaterializedChatroomRespository } from '../ports/upsert-materialized-chatroom.respository';

@EventsHandler(CreatedChatroomEvent)
export class CreatedChatroomEventHandler
  implements IEventHandler<CreatedChatroomEvent>
{
  private readonly logger = new Logger(CreatedChatroomEventHandler.name);

  constructor(
    private readonly upsertMaterializedChatroomRepository: UpsertMaterializedChatroomRespository,
  ) {}

  async handle(event: CreatedChatroomEvent): Promise<void> {
    this.logger.log(`Created chatroom event: ${JSON.stringify(event)}`);

    // * 同步資料到 read db
    this.upsertMaterializedChatroomRepository.upsert(event.chatroom);

    // * socket 通知其他被加入的的使用者
  }
}
