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
import { Cron, CronExpression } from '@nestjs/schedule';
import { SignInDto } from './dto/request/sign-in.dto';
import { MessageSeenDto } from './dto/request/message-seen.dto';
import { MessageSeenCommand } from '../../application/commands/impl/message-seen.command';

@WebSocketGateway({ cors: true })
@UseFilters(WsExceptionFilter)
@UsePipes(new MessageBodyPipe())
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthenticationWebsocketGuard)
  @SubscribeMessage('sign-in')
  async signIn(@ConnectedSocket() socket: Socket): Promise<string> {
    return this.chatService.signIn(new SignInCommand(socket));
  }

  @SubscribeMessage('message')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: SendMessageDto,
  ) {
    const { chatroomId, content } = body;
    await this.chatService.sendMessage(
      new SendMessageCommand(chatroomId, socket, content),
    );
  }

  @SubscribeMessage('messageSeen')
  async messageSeen(@MessageBody() body: MessageSeenDto) {
    const { userId, chatroomId, lastAckId } = body;
    await this.chatService.messageSeen(
      new MessageSeenCommand(userId, chatroomId, lastAckId),
    );
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(
      'socket disconnected...',
      socket.id,
      socket[REQUEST_USER_KEY]?.sub,
    );
    return this.chatService.signOut(new SignOutCommand(socket));
  }
}
