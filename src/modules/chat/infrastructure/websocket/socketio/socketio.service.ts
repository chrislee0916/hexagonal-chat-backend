import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketService } from 'src/modules/chat/application/ports/websocket.service';
import { ChatroomUserEntity } from '../../persistence/orm/entities/chatroom_user.entity';
import { Repository } from 'typeorm';

@WebSocketGateway()
export class SocketIOService implements WebSocketService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(ChatroomUserEntity)
    private readonly chatroomUserRepository: Repository<ChatroomUserEntity>,
  ) {}

  async loadChatrooms(userId: number, socket: Socket): Promise<void> {
    const chatrooms = await this.chatroomUserRepository.findBy({ userId });

    const chatroomIds = chatrooms.map((chatroom) =>
      this.getKey(chatroom.chatroomId),
    );
    await socket.join(chatroomIds);
  }

  getKey(chatroomId: number): string {
    return `chatroom-${chatroomId}`;
  }
}
