import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AcceptFriendCommand } from '../impl/accept-friend.command';
import { CreateUserRepository } from '../../ports/create-user.repository';
import { User } from 'src/modules/iam/domain/user';

@CommandHandler(AcceptFriendCommand)
export class AcceptFriendCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(AcceptFriendCommandHandler.name);

  constructor(
    private readonly createUserRepository: CreateUserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: AcceptFriendCommand): Promise<void> {
    this.logger.debug(
      `Processing "${AcceptFriendCommand.name}": ${JSON.stringify(command)}`,
    );
    const { userId, friendId } = command;
    const [user, friend] = await this.createUserRepository.acceptFriend(
      userId,
      friendId,
    );

    // * 同步資料到 read-db
    user.acceptedFriend(friend);
    this.eventPublisher.mergeObjectContext(user);
    user.commit();
  }
}
