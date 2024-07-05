import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateGroupChatroomCommand } from '../impl/create-chatroom.command';
import { Logger } from '@nestjs/common';
import { CreateChatroomRepository } from '../../ports/create-chatroom.repository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { ChatroomFactory } from 'src/modules/chat/domain/factories/chatroom.factory';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';
import { CreateChatroomResponseDto } from 'src/modules/chat/presenters/http/dto/response/create-chatroom.response.dto';

@CommandHandler(CreateGroupChatroomCommand)
export class CreateChatroomCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(CreateChatroomCommandHandler.name);

  constructor(
    private readonly createChatroomRepository: CreateChatroomRepository,
    private readonly chatroomFactory: ChatroomFactory,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: CreateGroupChatroomCommand,
  ): Promise<CreateChatroomResponseDto> {
    this.logger.debug(
      `Processing "${CreateGroupChatroomCommand.name}": ${JSON.stringify(command)}`,
    );
    // ! 應該要去確認 userIds 是否存在
    // TODO: 應該需要發一個 ChatroomCreated 事件到 iam bounded context 確認 userIds 是否存在
    // TODO: 並在 chat bounded context 監聽 UserAddedToChatroom 事件確保使用者都存在或是有其他做法?

    let chatroom = await this.createChatroomRepository.save(
      this.chatroomFactory.create(command.name, command.userIds),
    );
    // TODO: 建立還需使用 socket.io 去通知對方訊息
    chatroom.created();
    this.eventPublisher.mergeObjectContext(chatroom);
    chatroom.commit();

    return {
      id: chatroom.id,
      name: chatroom.name,
    };
    // await this.createChatroomRepository.addUsers(chatroom.id, command.userIds);
    // return chatroom;
  }
}
