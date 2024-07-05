import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { AskFriendCommand } from '../impl/ask-friend.command';
import { FindUserRepository } from '../../ports/find-user.repository';
import { CreateUserRepository } from '../../ports/create-user.repository';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { User } from 'src/modules/iam/domain/user';
import { UserAskedFriendEvent } from 'src/modules/iam/domain/events/user-asked-friend.event';

@CommandHandler(AskFriendCommand)
export class AskFriendCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(AskFriendCommandHandler.name);

  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly createUserRepository: CreateUserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AskFriendCommand): Promise<void> {
    this.logger.debug(
      `Processing "${AskFriendCommand.name}": ${JSON.stringify(command)}`,
    );

    const { userId, friendEmail } = command;
    // * 發送好友邀請
    const { shouldUpdate, socketEvents } =
      await this.createUserRepository.askFriend(userId, friendEmail);
    // * 送出邀請後通知對方消息以及同步資料到 read db
    await this.eventBus.publish(
      new UserAskedFriendEvent(shouldUpdate, socketEvents),
      {
        skipHandler: true,
      },
    );
  }
}
