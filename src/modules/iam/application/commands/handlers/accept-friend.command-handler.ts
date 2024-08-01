import { Logger, NotFoundException } from '@nestjs/common';
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
import { InjectModel } from '@nestjs/mongoose';
import {
  MaterializedUserView,
  MaterializedUserViewDocument,
} from 'src/modules/iam/infrastructure/persistence/orm/schemas/materialized-user-view.schema';
import { Model } from 'mongoose';
import { FindUserRepository } from '../../ports/find-user.repository';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';

@CommandHandler(AcceptFriendCommand)
export class AcceptFriendCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(AcceptFriendCommandHandler.name);

  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly createUserRepository: CreateUserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AcceptFriendCommand): Promise<void> {
    this.logger.debug(
      `Processing "${AcceptFriendCommand.name}": ${JSON.stringify(command)}`,
    );
    const { userId, friendId } = command;

    // * 檢查user是否存在
    const userModel = await this.findUserRepository.findOneById(userId);
    if (!userModel) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    }
    // * 檢查被接受的user是否存在
    const friendModel = await this.findUserRepository.findOneById(friendId);
    if (!friendModel) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    }
    // * 檢查好友邀請是否存在
    const askingIdx = userModel.askFriends.findIndex(
      (val) => val.id === friendModel.id,
    );
    if (askingIdx === -1) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_ASK_FRIEND_NOT_FOUND);
    }

    const event = await this.createUserRepository.acceptFriend(
      userModel,
      friendModel,
    );
    // * 同步資料到 read-db
    await this.eventBus.publish(event, { skipHandler: true });
  }
}
