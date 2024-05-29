import { DynamicModule, Module, Type } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from '../presenters/http/chat.controller';
import { CreateChatroomCommandHandler } from './commands/handlers/create-chatroom.command-handler';
import { CreateChatroomRepository } from './ports/create-chatroom.repository';
import { OrmCreateChatroomRepository } from '../infrastructure/persistence/orm/repositories/create-chatroom.repository';
import { ChatroomFactory } from '../domain/factories/chatroom.factory';

@Module({
  controllers: [ChatController],
  providers: [ChatService, CreateChatroomCommandHandler, ChatroomFactory],
})
export class ChatModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: ChatModule,
      imports: [infrastructureModule],
    };
  }
}
