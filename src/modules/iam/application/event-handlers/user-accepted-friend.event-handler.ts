import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAcceptedFriendEvent } from '../../domain/events/user-accepted-friend.event';
import { Logger } from '@nestjs/common';
import { FindUserRepository } from '../ports/find-user.repository';
import { UpsertMaterializedUserRepository } from '../ports/upsert-materialized-user.repository';
import { ObjectId } from 'typeorm';
import { UserReadModel } from '../../domain/read-models/user.read-model';
import { Types } from 'mongoose';
import { WebSocketService } from 'src/modules/chat/application/ports/websocket.service';

@EventsHandler(UserAcceptedFriendEvent)
export class UserAcceptedFriendEventHandler
  implements IEventHandler<UserAcceptedFriendEvent>
{
  private readonly logger = new Logger(UserAcceptedFriendEventHandler.name);

  constructor(
    private readonly upsertMaterializedUserRepository: UpsertMaterializedUserRepository,
    private readonly webSocketService: WebSocketService,
  ) {}
  async handle(event: UserAcceptedFriendEvent) {
    this.logger.log(`User accepted friend event: ${JSON.stringify(event)}`);

    const { shouldUpdate, socketEvents } = event;
    // TODO: 後續改用 CDC
    // * 同步資料到 read db
    await Promise.all(
      shouldUpdate.map((user) => {
        return this.upsertMaterializedUserRepository.upsert({
          id: user.id,
          askFriends: user.askFriends,
          friends: user.friends,
        });
      }),
    );

    // TODO: socket 同步通知對方有新好友加入
    await Promise.all(
      socketEvents.map((socketEvent) => {
        return this.webSocketService.sendToPerson<typeof socketEvent.data>(
          socketEvent.event,
          socketEvent.userId,
          socketEvent.data,
        );
      }),
    );
  }
}
