import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';

import { HttpStatus, Logger } from '@nestjs/common';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketOnlineIdsStorage } from '../../ports/socket-online-ids.storage';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { CreateChatroomRepository } from '../../ports/create-chatroom.repository';
import { Message } from 'src/modules/chat/domain/message';
import { CreateMessageRepository } from '../../ports/create-message.repository';
import { REQUEST_USER_KEY } from 'src/common/decorators/active-user.decorator';
import { MessageSeenCommand } from '../impl/message-seen.command';
import { UpdateChatroomUserRepository } from '../../ports/update-chatroom-user';
import { MessageSeenEvent } from 'src/modules/chat/domain/events/message-seen.event';

@CommandHandler(MessageSeenCommand)
export class MessageSeenCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(MessageSeenCommandHandler.name);

  constructor(
    private readonly chatroomUserRepository: UpdateChatroomUserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: MessageSeenCommand): Promise<any> {
    this.logger.debug(
      `Processing "${MessageSeenCommand.name}": ${JSON.stringify(command)}`,
    );

    const { chatroomId, userId, lastAckId } = command;
    await this.chatroomUserRepository.update({ chatroomId, userId, lastAckId });

    // * 更新後通知用戶端哪些用戶有已讀
    await this.eventBus.publish(
      new MessageSeenEvent(userId, chatroomId, lastAckId),
      { skipHandler: true },
    );
  }
}
