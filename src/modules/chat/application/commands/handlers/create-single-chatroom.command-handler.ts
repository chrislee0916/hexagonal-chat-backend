import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateSingleChatroomCommand } from '../impl/create-chatroom.command';
import { Logger } from '@nestjs/common';
import { CreateChatroomRepository } from '../../ports/create-chatroom.repository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';
import { ChatroomFactory } from 'src/modules/chat/domain/factories/chatroom.factory';
import { ChatroomReadModel } from 'src/modules/chat/domain/read-models/chatroom.read-model';
import { CreateChatroomResponseDto } from 'src/modules/chat/presenters/http/dto/response/create-chatroom.response.dto';
import { FindChatroomRepository } from '../../ports/find-chatroom.repository';

@CommandHandler(CreateSingleChatroomCommand)
export class CreateChatroomCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(CreateChatroomCommandHandler.name);

  constructor(
    private readonly createChatroomRepository: CreateChatroomRepository,
    private readonly findChatroomRepository: FindChatroomRepository,
    private readonly chatroomFactory: ChatroomFactory,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: CreateSingleChatroomCommand,
  ): Promise<CreateChatroomResponseDto> {
    this.logger.debug(
      `Processing "${CreateSingleChatroomCommand.name}": ${JSON.stringify(command)}`,
    );

    const exist = await this.findChatroomRepository.findOne(
      command.userId,
      command.friendId,
    );
    if (exist) {
      return exist;
    }

    let chatroom = await this.createChatroomRepository.save(
      this.chatroomFactory.create(command.name, [
        command.userId,
        command.friendId,
      ]),
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
