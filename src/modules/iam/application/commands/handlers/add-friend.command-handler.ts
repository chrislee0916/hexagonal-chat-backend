import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AskFriendCommand } from '../impl/add-friend.command';
import { FindUserRepository } from '../../ports/find-user.repository';
import { CreateUserRepository } from '../../ports/create-user.repository';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { User } from 'src/modules/iam/domain/user';

@CommandHandler(AskFriendCommand)
export class AskFriendCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(AskFriendCommandHandler.name);

  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly createUserRepository: CreateUserRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AskFriendCommand): Promise<void> {
    this.logger.debug(
      `Processing "${AskFriendCommand.name}": ${JSON.stringify(command)}`,
    );

    const { userId, friendId } = command;
    // * 判斷要加入的 user 是否存在
    const friendModel = await this.findUserRepository.findOneById(friendId);
    if (!friendModel) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    }
    // * 判斷 user 是否存在
    const userModel = await this.findUserRepository.findOneById(userId);
    if (!userModel) {
      throw new NotFoundException(ErrorMsg.ERR_AUTH_USER_NOT_FOUND);
    }
    // * 是否在 friend 已是好友
    const existOnFriend = friendModel.friends?.find((val) => val.id === userId);
    // * 是否在 user 已是好友
    const existOnUser = userModel.friends?.find((val) => val.id === friendId);
    if (existOnFriend || existOnUser) {
      throw new ConflictException(ErrorMsg.ERR_AUTH_USER_ALREADY_FRIEND);
    }
    // * 送出好友邀請
    await this.createUserRepository.askFriend(userId, friendId);

    // * 送出邀請後通知對方消息
    const user = new User();
    user.id = userId;
    user.askedFriend(friendId);
    this.publisher.mergeObjectContext(user);
    user.commit();
  }
}
