import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  BrocastType,
  WebSocketService,
} from 'src/modules/chat/application/ports/websocket.service';
import { ChatroomUserEntity } from '../../persistence/orm/entities/chatroom_user.entity';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { SocketOnlineIdsStorage } from 'src/modules/chat/application/ports/socket-online-ids.storage';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { InjectModel } from '@nestjs/mongoose';
import { ChatroomUser } from 'src/modules/chat/domain/chatroom-user';
import { Model } from 'mongoose';
import { ChatroomUserDocument } from '../../persistence/orm/schemas/chatroom-user.schema';

@WebSocketGateway()
export class SocketIOService implements WebSocketService {
  @WebSocketServer()
  server: Server;

  constructor(
    // @InjectRepository(ChatroomUserEntity)
    // private readonly chatroomUserRepository: Repository<ChatroomUserEntity>,
    @InjectModel(ChatroomUser.name)
    private readonly chatroomUserModel: Model<ChatroomUserDocument>,
    private readonly socketOnlineIdsStorage: SocketOnlineIdsStorage,
  ) {}

  /**
   * if sign-up to server, then load their rooms.
   */
  async loadChatrooms(userId: number, socket: Socket): Promise<void> {
    const chatrooms = await this.chatroomUserModel.find({ userId }).exec();
    const chatroomIds = chatrooms.map((chatroom) =>
      this.getKey(chatroom.chatroomId),
    );
    await socket.join(chatroomIds);
  }

  /**
   * join users to room after room created.
   */
  async joinChatroom(chatroomId: number, userIds: number[]): Promise<void> {
    for (let id of userIds) {
      const socketId = await this.socketOnlineIdsStorage.getSocketId(id);
      const socket = this.server.sockets.sockets.get(socketId);
      await socket.join(this.getKey(chatroomId));
    }
  }

  /**
   * brocast event to room.
   */
  brocastToChatroom(event: BrocastType, chatroomId: number, data: any): void {
    // const res = this.server.in(this.getKey(chatroomId)).emit(event, data);
    this.server
      .in(this.getKey(chatroomId))
      // .timeout(1000)
      .emit(event, data);
  }

  /**
   * send event to specific online person.
   */
  async sendToPerson<T = any>(
    event: 'newAskFriend' | 'newFriend',
    userId: number,
    data: T,
  ): Promise<void> {
    const socketId = await this.socketOnlineIdsStorage.getSocketId(userId);
    if (socketId) {
      this.server.sockets.sockets.get(socketId)?.emit(event, data);
    }
  }

  private getKey(chatroomId: number): string {
    return `chatroom-${chatroomId}`;
  }
}
