import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketService } from 'src/modules/chat/application/ports/websocket.service';
import { ChatroomUserEntity } from '../../persistence/orm/entities/chatroom_user.entity';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { SocketOnlineIdsStorage } from 'src/modules/chat/application/ports/socket-online-ids.storage';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@WebSocketGateway()
export class SocketIOService implements WebSocketService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(ChatroomUserEntity)
    private readonly chatroomUserRepository: Repository<ChatroomUserEntity>,
    private readonly socketOnlineIdsStorage: SocketOnlineIdsStorage,
  ) {}

  async loadChatrooms(userId: number, socket: Socket): Promise<void> {
    const chatrooms = await this.chatroomUserRepository.findBy({ userId });

    const chatroomIds = chatrooms.map((chatroom) =>
      this.getKey(chatroom.chatroomId),
    );
    await socket.join(chatroomIds);
  }

  async joinChatroom(chatroomId: number, userIds: number[]): Promise<void> {
    const offlineUsers = [];
    userIds.forEach(async (id) => {
      const socketId = await this.socketOnlineIdsStorage.getSocketId(id);
      if (!socketId) {
        offlineUsers.push(id);
        return;
      }
      const socket = this.server.sockets.sockets.get(socketId);
      await socket.join(this.getKey(chatroomId));
    });
  }

  async brocastToChatroom<T = any>(
    event: 'createChatroom' | 'message',
    chatroomId: number,
    data: T,
  ): Promise<void> {
    this.server.in(this.getKey(chatroomId)).emit(event, data);
  }

  async sendToPerson<T = any>(
    event: 'newAskFriend' | 'newFriend',
    userId: number,
    data: T,
  ): Promise<void> {
    const socketId = await this.socketOnlineIdsStorage.getSocketId(userId);
    this.server.sockets.sockets.get(socketId).emit(event, data);
  }

  private getKey(chatroomId: number): string {
    return `chatroom-${chatroomId}`;
  }
}
