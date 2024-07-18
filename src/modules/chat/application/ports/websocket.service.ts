import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type BrocastType =
  | 'createChatroom'
  | 'message'
  | 'messageSeen'
  | 'chatroomNewMessage';
export abstract class WebSocketService {
  abstract loadChatrooms(userId: number, userSocket: Socket): Promise<void>;
  abstract joinChatroom(chatroomId: number, userIds: number[]): Promise<void>;
  abstract brocastToChatroom(
    event: BrocastType,
    chatroomId: number,
    data: any,
  ): void;
  abstract sendToPerson<T = any>(
    event: 'newAskFriend' | 'newFriend',
    userId: number,
    data: T,
  ): Promise<void>;
}
