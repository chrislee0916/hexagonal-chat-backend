import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SendMessageCommand } from '../impl/send-message.command';
import { HttpStatus, Logger } from '@nestjs/common';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketOnlineIdsStorage } from '../../ports/socket-online-ids.storage';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { Chatroom } from 'src/modules/chat/domain/chatroom';

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(SendMessageCommandHandler.name);

  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly socketOnlineIdsStorage: SocketOnlineIdsStorage,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: SendMessageCommand): Promise<any> {
    this.logger.debug(
      `Processing "${SendMessageCommand.name}": ${JSON.stringify({ ...command, socket: '' })}`,
    );

    const { chatroomId, userId, socket, content } = command;
    // * 確認發訊息的與在線上的人同個 socketId
    const onlineSocketId =
      await this.socketOnlineIdsStorage.getSocketId(userId);

    if (onlineSocketId !== socket.id) {
      throw new WsException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ErrorMsg.ERR_AUTH_INVALID_SEND_MESSAGE,
      });
    }
    if (!socket.rooms.has(`${chatroomId}`)) {
      throw new WsException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ErrorMsg.ERR_COMMON_RESOURCE_NOT_FOUND,
      });
    }

    // * 需要檢查chatroom底下的user有哪些不在線上，使用離線訊息
    this.server.to(`${chatroomId}`).emit('message', content);
    const chatroom = new Chatroom();
    chatroom.id = chatroomId;
    chatroom.sentMessage(userId, content);
    this.eventPublisher.mergeObjectContext(chatroom);
    chatroom.commit();
  }
}
