import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateChatroomCommand } from '../impl/create-chatroom.command';
import { Logger } from '@nestjs/common';
import { CreateChatroomRepository } from '../../ports/create-chatroom.repository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { ChatroomFactory } from 'src/modules/chat/domain/factories/chatroom.factory';

@CommandHandler(CreateChatroomCommand)
export class CreateChatroomCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(CreateChatroomCommandHandler.name);

  constructor(
    private readonly createChatroomRepository: CreateChatroomRepository,
    private readonly chatroomFactory: ChatroomFactory,
  ) {}

  async execute(command: CreateChatroomCommand): Promise<Chatroom> {
    this.logger.debug(
      `Processing "${CreateChatroomCommand.name}": ${JSON.stringify(command)}`,
    );
    // ! 應該要去確認 userIds 是否存在
    // TODO: 應該需要發一個 ChatroomCreated 事件到 iam bounded context 確認 userIds 是否存在
    // TODO: 並在 chat bounded context 監聽 UserAddedToChatroom 事件確保使用者都存在或是有其他做法?
    let chatroom = this.chatroomFactory.create(command.name, command.userIds);
    return this.createChatroomRepository.save(chatroom);
    // TODO: 建立還需使用 socket.io 去通知對方訊息
    // await this.createChatroomRepository.addUsers(chatroom.id, command.userIds);
    // return chatroom;
  }
}
