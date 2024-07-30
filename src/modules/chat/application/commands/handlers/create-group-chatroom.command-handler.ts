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
    /**
     * insert chatroom & chatroomUser into write-db.
     */
    let chatroom = await this.createChatroomRepository.save(
      this.chatroomFactory.create(command.name, command.userIds),
    );
    /**
     * sync data from write-db to read-db and use socket.io to inform online user.
     */
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
