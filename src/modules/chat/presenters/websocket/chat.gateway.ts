import {
  BeforeApplicationShutdown,
  HttpStatus,
  OnApplicationShutdown,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ActiveUser,
  REQUEST_USER_KEY,
} from 'src/common/decorators/active-user.decorator';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';
import { AuthenticationWebsocketGuard } from 'src/common/guards/websocket/authentication-websocket.guard';
import { ActiveUserData } from 'src/modules/iam/domain/interfaces/active-user-data.interface';
import { SignInCommand } from '../../application/commands/impl/sign-in.command';
import { ChatService } from '../../application/chat.service';
import { SignOutCommand } from '../../application/commands/impl/sign-out.command';
import { SendMessageCommand } from '../../application/commands/impl/send-message.command';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';

@WebSocketGateway()
@UseFilters(WsExceptionFilter)
@UseGuards(AuthenticationWebsocketGuard)
export class ChatGateway implements OnGatewayDisconnect, OnApplicationShutdown {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly chatService: ChatService) {}

  onApplicationShutdown() {
    this.server.sockets.disconnectSockets();
  }

  @SubscribeMessage('sign-in')
  async signIn(
    @ActiveUser() user: ActiveUserData,
    @ConnectedSocket() socket: Socket,
  ): Promise<string> {
    return this.chatService.signIn(new SignInCommand(user.sub, socket.id));
  }

  @SubscribeMessage('message')
  async sendMessage(
    @ActiveUser() user: ActiveUserData,
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { chatroomId: number; content: string },
  ) {
    const { chatroomId, content } = body;
    // this.server.to(chatroomId).emit('message', content);
    await this.chatService.sendMessage(
      new SendMessageCommand(chatroomId, user.sub, socket, content),
    );
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    return this.chatService.signOut(new SignOutCommand(socket));
  }
}
