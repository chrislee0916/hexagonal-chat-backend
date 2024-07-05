import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from '../impl/sign-in.command';
import { HttpStatus, Logger } from '@nestjs/common';
import { SocketOnlineIdsStorage } from '../../ports/socket-online-ids.storage';
import { WsException } from '@nestjs/websockets';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { CreateChatroomRepository } from '../../ports/create-chatroom.repository';
import { SocketIOService } from 'src/modules/chat/infrastructure/websocket/socketio/socketio.service';
import { WebSocketService } from '../../ports/websocket.service';
import { REQUEST_USER_KEY } from 'src/common/decorators/active-user.decorator';

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(SignInCommandHandler.name);

  constructor(
    private readonly socketOnlineIdsStorage: SocketOnlineIdsStorage,
    private readonly webSocketService: WebSocketService,
  ) {}

  async execute(command: SignInCommand): Promise<string> {
    this.logger.debug(`Processing "${SignInCommand.name}"`);
    const { socket } = command;
    const userId: number = socket[REQUEST_USER_KEY].sub;
    // // * 同個使用者只允許一個在線
    // const onlineSocketId =
    //   await this.socketOnlineIdsStorage.getSocketId(userId);
    // if (onlineSocketId) {
    //   throw new WsException({
    //     statusCode: HttpStatus.UNAUTHORIZED,
    //     message: ErrorMsg.ERR_AUTH_ALREADY_ONLINE,
    //   });
    // }

    // * redis 記錄上線狀態
    await this.socketOnlineIdsStorage.signIn(userId, socket.id);
    // * 載入聊天室以接收到即時訊息
    await this.webSocketService.loadChatrooms(userId, socket);

    return socket.id;
  }
}
