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

    const { userData, friendEmail } = command;
    // * 是否為同個人
    if (userData.email === friendEmail) {
      throw new BadRequestException(ErrorMsg.ERR_AUTH_ASK_FRIEND_TO_MYSELF);
    }
    const userModel = await this.findUserRepository.findOneById(userData.sub);
    if (!userModel) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    }
    const askedUserModel =
      await this.findUserRepository.findOneByEmail(friendEmail);
    if (!askedUserModel) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    }

    // * 發送好友邀請
    const event = await this.createUserRepository.askFriend(
      userModel,
      askedUserModel,
    );
    // * 送出邀請後通知對方消息以及同步資料到 read db
    await this.eventBus.publish(event, {
      skipHandler: true,
    });
  }
}
