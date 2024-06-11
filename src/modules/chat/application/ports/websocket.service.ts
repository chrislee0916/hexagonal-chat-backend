import { Socket } from 'socket.io';

export abstract class WebSocketService {
  abstract loadChatrooms(userId: number, userSocket: Socket): Promise<void>;
}
