import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateChatroomCommand } from './commands/impl/create-chatroom.command';

@Injectable()
export class ChatService {
  constructor(private readonly commandBus: CommandBus) {}

  async createChatroom(createChatroomCommand: CreateChatroomCommand) {
    return this.commandBus.execute(createChatroomCommand);
  }
}
