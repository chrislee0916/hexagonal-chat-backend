import { Injectable, UseFilters } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChatroomCommand } from './commands/impl/create-chatroom.command';
import { SignInCommand } from './commands/impl/sign-in.command';
import { SignOutCommand } from './commands/impl/sign-out.command';
import { SendMessageCommand } from './commands/impl/send-message.command';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { FindOneChatroomQuery } from './querys/impl/find-one-chatroom.query';

@Injectable()
export class ChatService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async createChatroom(createChatroomCommand: CreateChatroomCommand) {
    return this.commandBus.execute(createChatroomCommand);
  }

  async findOneChatroom(findOneChatroomQuery: FindOneChatroomQuery) {
    return this.queryBus.execute(findOneChatroomQuery);
  }

  async signIn(signInCommand: SignInCommand) {
    return this.commandBus.execute(signInCommand);
  }

  async sendMessage(sendMessageCommand: SendMessageCommand) {
    return this.commandBus.execute(sendMessageCommand);
  }

  async signOut(signOutCommand: SignOutCommand) {
    return this.commandBus.execute(signOutCommand);
  }
}
