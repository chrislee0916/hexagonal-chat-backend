import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserSignedUpEvent } from '../../domain/events/user-signed-up.event';
import { Logger } from '@nestjs/common';
import { UpsertMaterializedUserRepository } from '../ports/upsert-materialized-user.repository';

@EventsHandler(UserSignedUpEvent)
export class UserSignedUpEventHandler
  implements IEventHandler<UserSignedUpEvent>
{
  private readonly logger = new Logger(UserSignedUpEventHandler.name);

  constructor(
    private readonly upsertMaterializedUserRepository: UpsertMaterializedUserRepository,
  ) {}

  async handle(event: UserSignedUpEvent) {
    this.logger.log(`User signed up event: ${JSON.stringify(event)}`);
    await this.upsertMaterializedUserRepository.upsert({
      id: event.user.id,
      name: event.user.name,
      email: event.user.email,
      password: event.user.password,
      image: event.user.image,
      createdAt: event.user.createdAt,
      updatedAt: event.user.updatedAt,
    });
  }
}
