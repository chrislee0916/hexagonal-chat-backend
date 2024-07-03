import { DynamicModule, Module, Type } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from '../presenters/http/chat.controller';
import { CreateChatroomCommandHandler } from './commands/handlers/create-chatroom.command-handler';
import { CreateChatroomRepository } from './ports/create-chatroom.repository';
import { ChatroomFactory } from '../domain/factories/chatroom.factory';
import { ChatGateway } from '../presenters/websocket/chat.gateway';
import { AuthenticationWebsocketGuard } from 'src/common/guards/websocket/authentication-websocket.guard';
import { JwtService } from '@nestjs/jwt';
import { SignInCommandHandler } from './commands/handlers/sign-in.command-handler';
import { SignOutCommandHandler } from './commands/handlers/sign-out.command-handler';
import { SendMessageCommandHandler } from './commands/handlers/send-message.command.handler';
import { SentMessageEventHandler } from './event-handlers/sent-message.event-handler';
import { CreatedChatroomEventHandler } from './event-handlers/created-chatroom.event-handler';
import { FindOneChatroomQueryHandler } from './querys/handlers/find-one-chatroom.query-handler';

@Module({
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    CreateChatroomCommandHandler,
    SignInCommandHandler,
    SignOutCommandHandler,
    SendMessageCommandHandler,
    FindOneChatroomQueryHandler,
    ChatroomFactory,
    JwtService,
    SentMessageEventHandler,
    CreatedChatroomEventHandler,
  ],
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
