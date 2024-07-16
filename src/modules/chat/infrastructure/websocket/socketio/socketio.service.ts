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
    for (let id of userIds) {
      console.log('userId: ', id);
      const socketId = await this.socketOnlineIdsStorage.getSocketId(id);
      if (!socketId) {
        offlineUsers.push(id);
        return;
      }
      console.log('socketId: ', socketId);
      const socket = this.server.sockets.sockets.get(socketId);
      await socket.join(this.getKey(chatroomId));
    }
  }

  async brocastToChatroom<T = any>(
    event: 'createChatroom' | 'message',
    chatroomId: number,
    data: T,
  ): Promise<void> {
    // const res = this.server.in(this.getKey(chatroomId)).emit(event, data);
    const res = await this.server
      .in(this.getKey(chatroomId))
      .timeout(1000)
      .emitWithAck(event, data);

    // TODO: 之後可以改良成批量更新 eventually consistency
    // * 需要去更新 chatroomuser 資料
    console.log('is success: ', res);
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
