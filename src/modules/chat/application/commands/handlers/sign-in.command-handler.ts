import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from '../impl/sign-in.command';
import { HttpStatus, Logger } from '@nestjs/common';
import { SocketOnlineIdsStorage } from '../../ports/socket-online-ids.storage';
import { WsException } from '@nestjs/websockets';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(SignInCommandHandler.name);

  constructor(
    private readonly socketOnlineIdsStorage: SocketOnlineIdsStorage,
  ) {}

  async execute(command: SignInCommand): Promise<string> {
    this.logger.debug(
      `Processing "${SignInCommand.name}": ${JSON.stringify(command)}`,
    );
    const { userId, socketId } = command;
    const onlineSocketId =
      await this.socketOnlineIdsStorage.getSocketId(userId);
    if (onlineSocketId) {
      throw new WsException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ErrorMsg.ERR_AUTH_ALREADY_ONLINE,
      });
    }

    await this.socketOnlineIdsStorage.signIn(userId, socketId);
    return socketId;
  }
}
