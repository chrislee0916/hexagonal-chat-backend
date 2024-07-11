import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

type BrocastType = 'createChatroom' | 'message' | 'chatroomNewMessage';
export abstract class WebSocketService {
  abstract loadChatrooms(userId: number, userSocket: Socket): Promise<void>;
  abstract joinChatroom(chatroomId: number, userIds: number[]): Promise<void>;
  abstract brocastToChatroom<T = any>(
    event: BrocastType,
    chatroomId: number,
    data: T,
  ): Promise<void>;
  abstract sendToPerson<T = any>(
    event: 'newAskFriend' | 'newFriend',
    userId: number,
    data: T,
  ): Promise<void>;
}
