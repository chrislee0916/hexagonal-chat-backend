import { Logger } from '@nestjs/common';
import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { AcceptFriendCommand } from '../impl/accept-friend.command';
import { CreateUserRepository } from '../../ports/create-user.repository';
import { User } from 'src/modules/iam/domain/user';
import { UserAcceptedFriendEvent } from 'src/modules/iam/domain/events/user-accepted-friend.event';

@CommandHandler(AcceptFriendCommand)
export class AcceptFriendCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(AcceptFriendCommandHandler.name);

  constructor(
    private readonly createUserRepository: CreateUserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AcceptFriendCommand): Promise<void> {
    this.logger.debug(
      `Processing "${AcceptFriendCommand.name}": ${JSON.stringify(command)}`,
    );
    const { userId, friendId } = command;
    const { shouldUpdate, socketEvents } =
      await this.createUserRepository.acceptFriend(userId, friendId);

    // * 同步資料到 read-db
    await this.eventBus.publish(
      new UserAcceptedFriendEvent(shouldUpdate, socketEvents),
      { skipHandler: true },
    );
  }
}
