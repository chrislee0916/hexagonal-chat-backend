import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateChatroomCommand } from '../impl/create-chatroom.command';
import { Logger } from '@nestjs/common';
import { CreateChatroomRepository } from '../../ports/create-chatroom.repository';
import { Chatroom } from 'src/modules/chat/domain/chatroom';

@CommandHandler(CreateChatroomCommand)
export class CreateChatroomCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(CreateChatroomCommandHandler.name);

  constructor(
    private readonly createChatroomRepository: CreateChatroomRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateChatroomCommand): Promise<Chatroom> {
    this.logger.debug(
      `Processing "${CreateChatroomCommand.name}": ${JSON.stringify(command)}`,
    );

    let chatroom = new Chatroom();
    chatroom.name = command.name;
    chatroom = await this.createChatroomRepository.save(chatroom);
    await this.createChatroomRepository.addUsers(chatroom.id, command.userIds);
    return chatroom;
  }
}
