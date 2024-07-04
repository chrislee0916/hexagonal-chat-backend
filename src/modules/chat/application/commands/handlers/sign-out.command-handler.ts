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
    await this.socketOnlineIdsStorage.signOut(command.socket.id);
  }
}
