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
    if (!userId) return;
    await this.socketOnlineIdsStorage.signOut(userId);
  }

  private extractUserIdFromSocket(socket: Socket): number | undefined {
    const user = socket[REQUEST_USER_KEY];
    return user?.sub;
  }
}
