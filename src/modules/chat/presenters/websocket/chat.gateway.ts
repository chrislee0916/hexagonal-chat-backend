import {
  ArgumentMetadata,
  BeforeApplicationShutdown,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  PipeTransform,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
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
import { SendMessageDto } from './dto/request/send-message.dto';
import { MessageBodyPipe } from 'src/common/pipes/message-body.pipe';

@WebSocketGateway({ cors: true })
@UseFilters(WsExceptionFilter)
@UsePipes(new MessageBodyPipe())
@UseGuards(AuthenticationWebsocketGuard)
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sign-in')
  async signIn(
    @ActiveUser() user: ActiveUserData,
    @ConnectedSocket() socket: Socket,
  ): Promise<string> {
    return this.chatService.signIn(new SignInCommand(user.sub, socket));
  }

  @SubscribeMessage('message')
  async sendMessage(
    @ActiveUser() user: ActiveUserData,
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: SendMessageDto,
  ) {
    const { chatroomId, content } = body;
    await this.chatService.sendMessage(
      new SendMessageCommand(chatroomId, user.sub, socket, content),
    );
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    return this.chatService.signOut(new SignOutCommand(socket));
  }
}
