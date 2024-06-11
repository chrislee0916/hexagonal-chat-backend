import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { HttpStatus, Logger } from '@nestjs/common';
import { SocketOnlineIdsStorage } from '../../ports/socket-online-ids.storage';
import { WsException } from '@nestjs/websockets';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { SignOutCommand } from '../impl/sign-out.command';
import { Socket } from 'socket.io';
import { REQUEST_USER_KEY } from 'src/common/decorators/active-user.decorator';

@CommandHandler(SignOutCommand)
export class SignOutCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(SignOutCommandHandler.name);

  constructor(
    private readonly socketOnlineIdsStorage: SocketOnlineIdsStorage,
  ) {}

  async execute(command: SignOutCommand): Promise<void> {
    this.logger.debug(`Processing "${SignOutCommand.name}"`);

    const userId = this.extractUserIdFromSocket(command.socket);
    // * 因為connect 沒辦法做驗證是否登陸 所以沒有userId 不處理
    if (!userId) return;
    const onlineSocketId =
      await this.socketOnlineIdsStorage.getSocketId(userId);
    // * 忽略登出的socketId與目前在線上不符合
    if (onlineSocketId !== command.socket.id) return;
    await this.socketOnlineIdsStorage.signOut(userId);
  }

  private extractUserIdFromSocket(socket: Socket): number | undefined {
    const user = socket[REQUEST_USER_KEY];
    return user?.sub;
  }
}
